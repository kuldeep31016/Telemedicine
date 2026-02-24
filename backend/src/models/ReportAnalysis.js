const mongoose = require('mongoose');

const reportAnalysisSchema = new mongoose.Schema({
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalReport',
        required: true,
        index: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    // Detected medical keywords from the report
    detectedKeywords: {
        type: [String],
        default: []
    },
    // Primary detected conditions/diseases
    detectedConditions: {
        type: [String],
        default: []
    },
    // Body parts/systems mentioned
    bodyParts: {
        type: [String],
        default: []
    },
    // Symptoms detected
    symptoms: {
        type: [String],
        default: []
    },
    // Confidence score (0-100)
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // Recommended specialists based on analysis
    recommendedSpecialists: [{
        specialty: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100
        },
        reason: {
            type: String
        }
    }],
    // Primary recommended specialist (highest confidence)
    primarySpecialist: {
        type: String,
        index: true
    },
    // AI/Analysis summary
    analysisSummary: {
        type: String,
        default: ''
    },
    // Whether analysis was successful
    analysisSuccess: {
        type: Boolean,
        default: false
    },
    // Analysis method used (gemini-ai or keyword-mapping)
    analysisMethod: {
        type: String,
        enum: ['gemini-ai', 'keyword-mapping', 'manual'],
        default: 'gemini-ai'
    },
    // Manual override by admin/doctor
    manualOverride: {
        isOverridden: {
            type: Boolean,
            default: false
        },
        overriddenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        },
        overriddenAt: {
            type: Date
        },
        overrideReason: {
            type: String
        },
        correctedSpecialist: {
            type: String
        }
    },
    // User action tracking
    userAction: {
        // Did user select a doctor after recommendation?
        doctorSelected: {
            type: Boolean,
            default: false
        },
        selectedDoctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        },
        selectedSpecialty: {
            type: String
        },
        appointmentBooked: {
            type: Boolean,
            default: false
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        },
        // Manual selection if auto-detection failed
        manuallySelectedSpecialty: {
            type: String
        },
        actionTakenAt: {
            type: Date
        }
    },
    // Medical history reference
    isPartOfMedicalHistory: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
reportAnalysisSchema.index({ patientId: 1, createdAt: -1 });
reportAnalysisSchema.index({ reportId: 1 });
reportAnalysisSchema.index({ primarySpecialist: 1 });
reportAnalysisSchema.index({ 'userAction.appointmentBooked': 1 });

// Virtual to check if recommendation is available
reportAnalysisSchema.virtual('hasRecommendation').get(function() {
    return this.recommendedSpecialists && this.recommendedSpecialists.length > 0;
});

// Method to set primary specialist (highest confidence)
reportAnalysisSchema.methods.setPrimarySpecialist = function() {
    if (this.recommendedSpecialists && this.recommendedSpecialists.length > 0) {
        // Sort by confidence and get the highest
        const sorted = this.recommendedSpecialists.sort((a, b) => b.confidence - a.confidence);
        this.primarySpecialist = sorted[0].specialty;
    }
    return this;
};

// Method to record doctor selection
reportAnalysisSchema.methods.recordDoctorSelection = async function(doctorId, specialty) {
    this.userAction.doctorSelected = true;
    this.userAction.selectedDoctorId = doctorId;
    this.userAction.selectedSpecialty = specialty;
    this.userAction.actionTakenAt = new Date();
    return this.save();
};

// Method to record appointment booking
reportAnalysisSchema.methods.recordAppointmentBooking = async function(appointmentId) {
    this.userAction.appointmentBooked = true;
    this.userAction.appointmentId = appointmentId;
    this.userAction.actionTakenAt = new Date();
    return this.save();
};

// Method to record manual specialty selection (when auto-detection fails)
reportAnalysisSchema.methods.recordManualSelection = async function(specialty) {
    this.userAction.manuallySelectedSpecialty = specialty;
    this.userAction.actionTakenAt = new Date();
    return this.save();
};

// Hide internal fields when converting to JSON
reportAnalysisSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('ReportAnalysis', reportAnalysisSchema);

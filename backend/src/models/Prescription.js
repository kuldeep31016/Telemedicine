const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        default: ''
    }
});

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        index: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        index: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    medicines: [medicineSchema],
    testsRecommended: [{
        type: String,
        trim: true
    }],
    followUpDate: {
        type: Date
    },
    specialInstructions: {
        type: String,
        default: ''
    },
    // PDF details
    pdfUrl: {
        type: String,
        required: true
    },
    pdfS3Key: {
        type: String,
        required: true
    },
    // QR code verification
    verificationCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // Metadata
    isActive: {
        type: Boolean,
        default: true
    },
    viewedByPatient: {
        type: Boolean,
        default: false
    },
    viewedAt: {
        type: Date
    },
    downloadCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for performance
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ appointmentId: 1 });

// Method to record view
prescriptionSchema.methods.recordView = async function() {
    if (!this.viewedByPatient) {
        this.viewedByPatient = true;
        this.viewedAt = new Date();
        await this.save();
    }
};

// Method to record download
prescriptionSchema.methods.recordDownload = async function() {
    this.downloadCount += 1;
    await this.save();
};

prescriptionSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Prescription', prescriptionSchema);

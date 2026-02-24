const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    reportType: {
        type: String,
        enum: ['pdf', 'image', 'lab_test', 'prescription', 'scan', 'other'],
        required: true
    },
    reportTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    // File storage details
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number, // in bytes
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    // S3 storage key for file management
    s3Key: {
        type: String,
        required: true
    },
    // Processing status
    processingStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
        index: true
    },
    // Extracted text from report (OCR/PDF parsing)
    extractedText: {
        type: String,
        default: ''
    },
    // Processing metadata
    processingError: {
        type: String
    },
    processedAt: {
        type: Date
    },
    // Tags for easier searching
    tags: {
        type: [String],
        default: []
    },
    // Report date (when the medical test/report was created)
    reportDate: {
        type: Date
    },
    // Visibility flag
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
medicalReportSchema.index({ patientId: 1, createdAt: -1 });
medicalReportSchema.index({ patientId: 1, processingStatus: 1 });
medicalReportSchema.index({ patientId: 1, reportType: 1 });

// Virtual for checking if report is processed
medicalReportSchema.virtual('isProcessed').get(function() {
    return this.processingStatus === 'completed';
});

// Method to mark as processing
medicalReportSchema.methods.markAsProcessing = function() {
    this.processingStatus = 'processing';
    return this.save();
};

// Method to mark as completed
medicalReportSchema.methods.markAsCompleted = function(extractedText = '') {
    this.processingStatus = 'completed';
    this.extractedText = extractedText;
    this.processedAt = new Date();
    return this.save();
};

// Method to mark as failed
medicalReportSchema.methods.markAsFailed = function(error) {
    this.processingStatus = 'failed';
    this.processingError = error;
    this.processedAt = new Date();
    return this.save();
};

// Hide sensitive fields when converting to JSON
medicalReportSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.s3Key; // Don't expose S3 key to frontend
    return obj;
};

module.exports = mongoose.model('MedicalReport', medicalReportSchema);

const mongoose = require('mongoose');

const ashaWorkerSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    role: {
        type: String,
        default: 'asha_worker'
    },
    assignedArea: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date
}, {
    timestamps: true
});

ashaWorkerSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('ASHAWorker', ashaWorkerSchema);

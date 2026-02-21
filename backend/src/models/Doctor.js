const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
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
        default: 'doctor'
    },
    specialization: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    experience: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 500
    },
    languages: {
        type: [String],
        default: ['English', 'Hindi']
    },
    availability: {
        type: String,
        default: 'Available Today'
    },
    rating: {
        type: Number,
        default: 4.5
    },
    profileImage: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    hospitalName: {
        type: String,
        default: 'City General Hospital'
    },
    hospitalAddress: {
        type: String,
        default: ''
    },
    location: {
        type: {
            lat: { type: Number },
            lng: { type: Number }
        },
        default: null
    },
    registrationNumber: {
        type: String,
        default: 'MC/825421'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date
}, {
    timestamps: true
});

doctorSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Doctor', doctorSchema);

const Doctor = require('../models/Doctor');
const { successResponse } = require('../utils/response.util');
const { ValidationError, NotFoundError } = require('../utils/error.util');
const logger = require('../config/logger');
const { s3Client, S3_BUCKET } = require('../config/s3');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

class DoctorController {
    /**
     * Get all active doctors
     */
    async getAllDoctors(req, res, next) {
        try {
            const { specialization, search, gender, minRating, minExperience, maxExperience, minFee, maxFee } = req.query;
            
            let query = { isActive: true };
            
            // Search across name, specialization, hospitalName
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                query.$or = [
                    { name: searchRegex },
                    { specialization: searchRegex },
                    { hospitalName: searchRegex }
                ];
            }
            
            // Filter by specialization if provided
            if (specialization) {
                query.specialization = new RegExp(specialization, 'i');
            }

            // Filter by gender
            if (gender && gender !== 'Any') {
                query.gender = new RegExp(gender, 'i');
            }

            // Filter by rating
            if (minRating) {
                query.rating = { $gte: Number(minRating) };
            }

            // Filter by experience
            if (minExperience !== undefined || maxExperience !== undefined) {
                query.experience = {};
                if (minExperience !== undefined) query.experience.$gte = Number(minExperience);
                if (maxExperience !== undefined) query.experience.$lte = Number(maxExperience);
            }

            // Filter by fee
            if (minFee !== undefined || maxFee !== undefined) {
                query.hourlyRate = {};
                if (minFee !== undefined) query.hourlyRate.$gte = Number(minFee);
                if (maxFee !== undefined) query.hourlyRate.$lte = Number(maxFee);
            }
            
            const doctors = await Doctor.find(query)
                .select('-firebaseUid -__v')
                .sort({ rating: -1, createdAt: -1 });
            
            logger.info(`Retrieved ${doctors.length} doctors`);
            return successResponse(res, doctors, 'Doctors retrieved successfully');
        } catch (error) {
            logger.error('Error fetching doctors:', error);
            next(error);
        }
    }

    /**
     * Get doctor by ID
     */
    async getDoctorById(req, res, next) {
        try {
            const { id } = req.params;
            
            const doctor = await Doctor.findById(id)
                .select('-firebaseUid -__v');
            
            if (!doctor) {
                throw new NotFoundError('Doctor not found');
            }
            
            if (!doctor.isActive) {
                throw new ValidationError('Doctor profile is not active');
            }
            
            logger.info(`Retrieved doctor: ${doctor.name}`);
            return successResponse(res, doctor, 'Doctor retrieved successfully');
        } catch (error) {
            logger.error('Error fetching doctor:', error);
            next(error);
        }
    }

    /**
     * Get current logged-in doctor's profile
     */
    async getMyProfile(req, res, next) {
        try {
            const doctor = await Doctor.findById(req.user._id)
                .select('-firebaseUid -__v');
            
            if (!doctor) {
                throw new NotFoundError('Doctor profile not found');
            }
            
            logger.info(`Retrieved profile for doctor: ${doctor.name}`);
            return successResponse(res, doctor, 'Profile retrieved successfully');
        } catch (error) {
            logger.error('Error fetching doctor profile:', error);
            next(error);
        }
    }

    /**
     * Update doctor profile
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user._id;
            const updateData = req.body;
            
            // Fields that can be updated by doctor
            const allowedFields = [
                'name',
                'phone',
                'specialization',
                'experience',
                'hourlyRate',
                'languages',
                'availability',
                'about',
                'hospitalName',
                'registrationNumber',
                'gender',
                'profileImage'
            ];
            
            // Filter out non-allowed fields
            const filteredData = {};
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });
            
            // Validate that there's something to update
            if (Object.keys(filteredData).length === 0) {
                throw new ValidationError('No valid fields to update');
            }
            
            // Validate hourlyRate if provided
            if (filteredData.hourlyRate !== undefined) {
                const rate = Number(filteredData.hourlyRate);
                if (isNaN(rate) || rate < 0) {
                    throw new ValidationError('Invalid hourly rate');
                }
                filteredData.hourlyRate = rate;
            }
            
            // Validate experience if provided
            if (filteredData.experience !== undefined) {
                const exp = Number(filteredData.experience);
                if (isNaN(exp) || exp < 0) {
                    throw new ValidationError('Invalid experience value');
                }
                filteredData.experience = exp;
            }
            
            // Update the doctor profile
            const updatedDoctor = await Doctor.findByIdAndUpdate(
                userId,
                { $set: filteredData },
                { new: true, runValidators: true }
            ).select('-firebaseUid -__v');
            
            if (!updatedDoctor) {
                throw new NotFoundError('Doctor profile not found');
            }
            
            logger.info(`Updated profile for doctor: ${updatedDoctor.name}`);
            return successResponse(res, updatedDoctor, 'Profile updated successfully');
        } catch (error) {
            logger.error('Error updating doctor profile:', error);
            next(error);
        }
    }

    /**
     * Upload doctor profile image to S3
     */
    async uploadProfileImage(req, res, next) {
        try {
            if (!req.file) {
                throw new ValidationError('No image file uploaded');
            }

            const userId = req.user._id;
            const ext = path.extname(req.file.originalname);
            const key = `doctors/${userId}_${Date.now()}${ext}`;

            // Upload to S3
            const putCommand = new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            });
            await s3Client.send(putCommand);

            const imageUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

            // Delete old S3 image if exists
            const doctor = await Doctor.findById(userId);
            if (doctor && doctor.profileImage && doctor.profileImage.includes(S3_BUCKET)) {
                try {
                    const oldKey = doctor.profileImage.split('.amazonaws.com/')[1];
                    if (oldKey) {
                        await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldKey }));
                        logger.info(`Deleted old S3 image: ${oldKey}`);
                    }
                } catch (delErr) {
                    logger.warn('Failed to delete old S3 image:', delErr.message);
                }
            }

            // Update doctor with new image URL
            const updatedDoctor = await Doctor.findByIdAndUpdate(
                userId,
                { $set: { profileImage: imageUrl } },
                { new: true }
            ).select('-firebaseUid -__v');

            if (!updatedDoctor) {
                throw new NotFoundError('Doctor profile not found');
            }

            logger.info(`Uploaded S3 profile image for doctor: ${updatedDoctor.name}`);
            return successResponse(res, updatedDoctor, 'Profile image uploaded successfully');
        } catch (error) {
            logger.error('Error uploading profile image:', error);
            next(error);
        }
    }
}

module.exports = new DoctorController();

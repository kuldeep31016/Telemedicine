const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/role.middleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'doctors');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `doctor_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// Protect all doctor routes
router.use(authenticate);

// Doctor profile routes (must be before /:id to avoid conflict)
router.get('/profile/me', isDoctor, doctorController.getMyProfile);
router.put('/profile', isDoctor, doctorController.updateProfile);
router.post('/profile/upload-photo', isDoctor, upload.single('profileImage'), doctorController.uploadProfileImage);

// Get all doctors (for patients)
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID (for patients)
router.get('/:id', doctorController.getDoctorById);

module.exports = router;

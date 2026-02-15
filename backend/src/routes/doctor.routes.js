const express = require('express');
const router = express.Router();
const multer = require('multer');
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isDoctor } = require('../middleware/role.middleware');

// Multer config – memory storage for S3 upload
const storage = multer.memoryStorage();

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

// Doctor dashboard and data routes (must be before /:id)
router.get('/dashboard/stats', isDoctor, doctorController.getDashboardStats);
router.get('/appointments', isDoctor, doctorController.getMyAppointments);
router.get('/patients', isDoctor, doctorController.getMyPatients);

// Doctor profile routes
router.get('/profile/me', isDoctor, doctorController.getMyProfile);
router.put('/profile', isDoctor, doctorController.updateProfile);
router.post('/profile/upload-photo', isDoctor, upload.single('profileImage'), doctorController.uploadProfileImage);

// Get all doctors (for patients)
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID (for patients)
router.get('/:id', doctorController.getDoctorById);

module.exports = router;

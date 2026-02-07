/**
 * API Services Index
 * Central export for all API services
 */
export { authAPI } from './auth.api';
export { adminAPI } from './admin.api';
export { doctorAPI } from './doctor.api';
export { patientAPI } from './patient.api';

// Re-export axios instance for direct use if needed
export { default as api } from '../config/axios';

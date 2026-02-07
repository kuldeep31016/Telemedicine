/**
 * API Routes Configuration
 * All backend API endpoints
 */

const API_VERSION = '/v1';

export const API_ROUTES = {
  // Authentication Routes
  AUTH: {
    REGISTER: `${API_VERSION}/auth/register`,
    LOGIN: `${API_VERSION}/auth/login`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    ME: `${API_VERSION}/auth/me`,
    PROFILE: `${API_VERSION}/auth/profile`,
    REFRESH_TOKEN: `${API_VERSION}/auth/refresh`,
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD_STATS: `${API_VERSION}/admin/dashboard/stats`,
    USERS: `${API_VERSION}/admin/users`,
    USER_BY_ID: (id) => `${API_VERSION}/admin/users/${id}`,
    USER_STATUS: (id) => `${API_VERSION}/admin/users/${id}/status`,
    DOCTORS: `${API_VERSION}/admin/doctors`,
    DOCTOR_BY_ID: (id) => `${API_VERSION}/admin/doctors/${id}`,
    APPOINTMENTS: `${API_VERSION}/admin/appointments`,
    SOS_ALERTS: `${API_VERSION}/admin/sos-alerts`,
  },

  // Doctor Routes
  DOCTOR: {
    DASHBOARD_STATS: `${API_VERSION}/doctor/dashboard/stats`,
    APPOINTMENTS: `${API_VERSION}/doctor/appointments`,
    APPOINTMENT_BY_ID: (id) => `${API_VERSION}/doctor/appointments/${id}`,
    PATIENTS: `${API_VERSION}/doctor/patients`,
    PATIENT_BY_ID: (id) => `${API_VERSION}/doctor/patients/${id}`,
    CONSULTATIONS: `${API_VERSION}/doctor/consultations`,
    PRESCRIPTIONS: `${API_VERSION}/doctor/prescriptions`,
  },

  // Patient Routes
  PATIENT: {
    DASHBOARD_STATS: `${API_VERSION}/patient/dashboard/stats`,
    APPOINTMENTS: `${API_VERSION}/patient/appointments`,
    APPOINTMENT_BY_ID: (id) => `${API_VERSION}/patient/appointments/${id}`,
    BOOK_APPOINTMENT: `${API_VERSION}/patient/appointments`,
    MEDICAL_RECORDS: `${API_VERSION}/patient/medical-records`,
    PRESCRIPTIONS: `${API_VERSION}/patient/prescriptions`,
  },

  // ASHA Worker Routes
  ASHA: {
    DASHBOARD_STATS: `${API_VERSION}/asha/dashboard/stats`,
    PATIENTS: `${API_VERSION}/asha/patients`,
    REPORTS: `${API_VERSION}/asha/reports`,
  },
};

export default API_ROUTES;

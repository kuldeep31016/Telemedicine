/**
 * Patient API Service
 * All patient-related API calls
 */
import api from '../config/axios';

export const patientAPI = {
  /**
   * Get patient dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    const response = await api.get('/v1/patient/dashboard/stats');
    return response.data;
  },

  /**
   * Get appointments
   * @param {Object} params - Query parameters
   * @returns {Promise} Appointments list
   */
  getAppointments: async (params = {}) => {
    const response = await api.get('/v1/patient/appointments', { params });
    return response.data;
  },

  /**
   * Book appointment
   * @param {Object} data - Appointment data
   * @returns {Promise} Created appointment
   */
  bookAppointment: async (data) => {
    const response = await api.post('/v1/patient/appointments', data);
    return response.data;
  },

  /**
   * Get medical records
   * @returns {Promise} Medical records
   */
  getMedicalRecords: async () => {
    const response = await api.get('/v1/patient/medical-records');
    return response.data;
  },

  /**
   * Get all available doctors
   * @returns {Promise} Doctors list
   */
  getDoctors: async () => {
    const response = await api.get('/v1/users?role=doctor');
    return response.data;
  },
};

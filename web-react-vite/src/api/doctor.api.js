/**
 * Doctor API Service
 * All doctor-related API calls
 */
import api from '../config/axios';

export const doctorAPI = {
  /**
   * Get doctor dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    const response = await api.get('/v1/doctor/dashboard/stats');
    return response.data;
  },

  /**
   * Get appointments
   * @param {Object} params - Query parameters
   * @returns {Promise} Appointments list
   */
  getAppointments: async (params = {}) => {
    const response = await api.get('/v1/doctor/appointments', { params });
    return response.data;
  },

  /**
   * Get patients
   * @param {Object} params - Query parameters
   * @returns {Promise} Patients list
   */
  getPatients: async (params = {}) => {
    const response = await api.get('/v1/doctor/patients', { params });
    return response.data;
  },

  /**
   * Update appointment status
   * @param {string} appointmentId - Appointment ID
   * @param {Object} data - Status update data
   * @returns {Promise} Updated appointment
   */
  updateAppointmentStatus: async (appointmentId, data) => {
    const response = await api.put(`/v1/doctor/appointments/${appointmentId}`, data);
    return response.data;
  },
};

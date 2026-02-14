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
   * @param {Object} params - Query parameters (status, startDate, endDate, page, limit)
   * @returns {Promise} Appointments list
   */
  getAppointments: async (params = {}) => {
    const response = await api.get('/v1/appointments', { params });
    return response.data;
  },

  /**
   * Cancel appointment
   * @param {String} appointmentId - Appointment ID
   * @param {String} reason - Cancellation reason
   * @returns {Promise} Cancelled appointment
   */
  cancelAppointment: async (appointmentId, reason) => {
    const response = await api.put(`/v1/appointments/${appointmentId}/cancel`, {
      cancellationReason: reason
    });
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
  getDoctors: async (params = {}) => {
    const response = await api.get('/v1/doctors', { params });
    return response.data;
  },

  /**
   * Create Razorpay order for appointment
   * @param {Object} data - Appointment and payment data
   * @returns {Promise} Razorpay order details
   */
  createAppointmentOrder: async (data) => {
    const response = await api.post('/v1/appointments/create-order', data);
    return response.data;
  },

  /**
   * Verify Razorpay payment
   * @param {Object} data - Payment verification data
   * @returns {Promise} Verified appointment
   */
  verifyPayment: async (data) => {
    const response = await api.post('/v1/appointments/verify-payment', data);
    return response.data;
  },
};

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
    const response = await api.get('/v1/doctors/dashboard/stats');
    return response.data;
  },

  /**
   * Get doctor's appointments
   * @param {Object} params - Query parameters (status, startDate, endDate, limit, page)
   * @returns {Promise} Appointments list
   */
  getMyAppointments: async (params = {}) => {
    const response = await api.get('/v1/doctors/appointments', { params });
    return response.data;
  },

  /**
   * Get doctor's patients
   * @param {Object} params - Query parameters (search, limit, page)
   * @returns {Promise} Patients list
   */
  getMyPatients: async (params = {}) => {
    const response = await api.get('/v1/doctors/patients', { params });
    return response.data;
  },

  /**
   * Get appointments (legacy - for backward compatibility)
   * @param {Object} params - Query parameters
   * @returns {Promise} Appointments list
   */
  getAppointments: async (params = {}) => {
    const response = await api.get('/v1/appointments', { params });
    return response.data;
  },

  /**
   * Get patients (legacy - for backward compatibility)
   * @param {Object} params - Query parameters
   * @returns {Promise} Patients list
   */
  getPatients: async (params = {}) => {
    const response = await api.get('/v1/appointments', { params });
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

  /**
   * Get all doctors
   * @param {Object} params - Query parameters (specialization, search)
   * @returns {Promise} Doctors list
   */
  getAllDoctors: async (params = {}) => {
    const response = await api.get('/v1/doctors', { params });
    return response.data;
  },

  /**
   * Get doctor by ID
   * @param {string} doctorId - Doctor ID
   * @returns {Promise} Doctor details
   */
  getDoctorById: async (doctorId) => {
    const response = await api.get(`/v1/doctors/${doctorId}`);
    return response.data;
  },

  /**
   * Get current doctor's profile
   * @returns {Promise} Doctor profile
   */
  getMyProfile: async () => {
    const response = await api.get('/v1/doctors/profile/me');
    return response.data;
  },

  /**
   * Update doctor profile
   * @param {Object} data - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (data) => {
    const response = await api.put('/v1/doctors/profile', data);
    return response.data;
  },

  /**
   * Upload doctor profile image
   * @param {File} imageFile - Image file to upload
   * @returns {Promise} Updated profile with image URL
   */
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    const response = await api.post('/v1/doctors/profile/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Reschedule appointment (Doctor only)
   * @param {String} appointmentId - Appointment ID
   * @param {Object} data - New date and time
   * @returns {Promise} Updated appointment
   */
  rescheduleAppointment: async (appointmentId, data) => {
    const response = await api.put(`/v1/appointments/${appointmentId}/reschedule`, data);
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
};

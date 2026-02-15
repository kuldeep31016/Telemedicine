/**
 * Video API Service
 * Handles Agora video consultation API calls
 */
import api from '../config/axios';

export const videoAPI = {
  /**
   * Generate Agora token for video consultation
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Token and channel details
   */
  generateToken: async (appointmentId) => {
    const response = await api.post('/v1/video/token', { appointmentId });
    return response.data;
  },

  /**
   * Validate if user can join consultation
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Validation result
   */
  validateConsultation: async (appointmentId) => {
    const response = await api.get(`/v1/video/validate/${appointmentId}`);
    return response.data;
  },

  /**
   * Start consultation (doctor initiates)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Start result
   */
  startConsultation: async (appointmentId) => {
    const response = await api.post(`/v1/video/start/${appointmentId}`);
    return response.data;
  },

  /**
   * End consultation
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} End result
   */
  endConsultation: async (appointmentId) => {
    const response = await api.post(`/v1/video/end/${appointmentId}`);
    return response.data;
  },

  /**
   * Get call status (for patient waiting room)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} Call status
   */
  getCallStatus: async (appointmentId) => {
    const response = await api.get(`/v1/video/status/${appointmentId}`);
    return response.data;
  }
};

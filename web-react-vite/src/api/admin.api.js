/**
 * Admin API Service
 * All admin-related API calls
 */
import api from '../config/axios';

export const adminAPI = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    const response = await api.get('/v1/admin/dashboard/stats');
    return response.data;
  },

  /**
   * Get all users
   * @param {Object} params - Query parameters
   * @returns {Promise} Users list
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/v1/admin/users', { params });
    return response.data;
  },

  /**
   * Get all doctors
   * @param {Object} params - Query parameters
   * @returns {Promise} Doctors list
   */
  getDoctors: async (params = {}) => {
    const response = await api.get('/v1/admin/doctors', { params });
    return response.data;
  },

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {Object} data - Status update data
   * @returns {Promise} Updated user
   */
  updateUserStatus: async (userId, data) => {
    const response = await api.put(`/v1/admin/users/${userId}/status`, data);
    return response.data;
  },
};

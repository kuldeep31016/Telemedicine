/**
 * Authentication API Service
 * All auth-related API calls
 */
import api from '../config/axios';

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} User data
   */
  register: async (userData) => {
    const response = await api.post('/v1/auth/register', userData);
    // Backend returns { success, message, data: userData }
    return response.data.data || response.data;
  },

  /**
   * Login user
   * @returns {Promise} User data
   */
  login: async () => {
    const response = await api.post('/v1/auth/login');
    // Backend returns { success, message, data: userData }
    return response.data.data || response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} User data
   */
  me: async () => {
    const response = await api.get('/v1/auth/me');
    // Backend returns { success, message, data: userData }
    return response.data.data || response.data;
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    const response = await api.post('/v1/auth/logout');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise} Updated user data
   */
  updateProfile: async (updates) => {
    const response = await api.put('/v1/auth/profile', updates);
    // Backend returns { success, message, data: userData }
    return response.data.data || response.data;
  },
};

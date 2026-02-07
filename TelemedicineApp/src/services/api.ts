import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API base URL - update with your IP
const API_BASE_URL = 'http://192.168.1.6:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register patient in MongoDB
  register: async (userData: {
    firebaseUid: string;
    role: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender?: string;
    address?: {
      city?: string;
      state?: string;
    };
    district?: string;
  }) => {
    const response = await api.post('/v1/auth/register', userData);
    return response.data;
  },

  // Login (get MongoDB user data)
  login: async (firebaseToken: string) => {
    const response = await api.post(
      '/v1/auth/login',
      {},
      {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      }
    );
    return response.data;
  },
};

export default api;

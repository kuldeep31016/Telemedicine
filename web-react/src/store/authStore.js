import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../config/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
      // State
      user: null,
      firebaseUser: null,
      loading: true,
      error: null,

      // Initialize auth listener
      initializeAuth: () => {
        if (!auth) {
          console.warn('Firebase not initialized. Skipping auth listener.');
          set({ loading: false });
          return () => {};
        }
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Get user data from backend
              const response = await api.get('/v1/auth/me');
              set({
                firebaseUser,
                user: response.data,
                loading: false,
                error: null,
              });
            } catch (error) {
              console.error('Error fetching user data:', error);
              set({
                firebaseUser,
                user: null,
                loading: false,
                error: error.message,
              });
            }
          } else {
            set({
              firebaseUser: null,
              user: null,
              loading: false,
              error: null,
            });
          }
        });

        return unsubscribe;
      },

      // Register new user
      register: async (email, password, userData) => {
        set({ loading: true, error: null });
        try {
          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;

          // Register in backend with firebaseUid
          const response = await api.post('/v1/auth/register', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData,
          });

          set({
            firebaseUser,
            user: response.data,
            loading: false,
            error: null,
          });

          toast.success('Registration successful!');
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Login user
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;

          // Login to backend (update lastLogin)
          const response = await api.post('/v1/auth/login');

          set({
            firebaseUser,
            user: response.data,
            loading: false,
            error: null,
          });

          toast.success('Login successful!');
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Logout user
      logout: async () => {
        set({ loading: true });
        try {
          await api.post('/v1/auth/logout');
          await signOut(auth);
          set({
            user: null,
            firebaseUser: null,
            loading: false,
            error: null,
          });
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
          set({ loading: false });
          toast.error('Logout failed');
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put('/v1/auth/profile', updates);
          set({
            user: response.data,
            loading: false,
            error: null,
          });
          toast.success('Profile updated successfully!');
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }));

export default useAuthStore;

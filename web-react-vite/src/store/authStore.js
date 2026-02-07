import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI } from '../api';
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
              // Get fresh token and fetch user data from backend
              const token = await firebaseUser.getIdToken();
              console.log('[Auth] Token refreshed, fetching user data...');
              
              const userData = await authAPI.me();
              
              set({
                firebaseUser,
                user: userData,
                loading: false,
                error: null,
              });
              console.log('[Auth] User data loaded:', userData);
            } catch (error) {
              console.error('Error fetching user data:', error);
              const errorMessage = error.response?.data?.message || error.message;
              set({
                firebaseUser,
                user: null,
                loading: false,
                error: errorMessage,
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
          console.log('[Auth] Starting registration for:', { email, role: userData.role });
          
          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;
          console.log('[Auth] Firebase user created:', firebaseUser.uid);

          // Get Firebase token
          const token = await firebaseUser.getIdToken();
          console.log('[Auth] Firebase token obtained');

          // Prepare user data - ensure password is NEVER sent to backend
          const { password: _, confirmPassword: __, ...userDataToSend } = userData;

          // Register in backend with firebaseUid
          const registrationData = {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDataToSend,
          };
          
          console.log('[Auth] Registering user in backend:', registrationData);
          const registeredUser = await authAPI.register(registrationData);

          console.log('[Auth] Registration successful:', registeredUser);

          set({
            firebaseUser,
            user: registeredUser,
            loading: false,
            error: null,
          });

          toast.success('Registration successful!');
          return registeredUser;
        } catch (error) {
          console.error('Registration error:', error);
          
          // If Firebase user was created but backend registration failed, clean up
          if (auth.currentUser) {
            try {
              await auth.currentUser.delete();
              console.log('[Auth] Cleaned up Firebase user after backend error');
            } catch (cleanupError) {
              console.error('[Auth] Failed to cleanup Firebase user:', cleanupError);
            }
          }
          
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

          // Get Firebase token
          const token = await firebaseUser.getIdToken();
          console.log('[Auth] Firebase login successful, syncing with backend...');

          // Login to backend and get user data
          await authAPI.login();
          
          // Fetch complete user profile
          const userData = await authAPI.me();

          set({
            firebaseUser,
            user: userData,
            loading: false,
            error: null,
          });

          console.log('[Auth] Login complete:', userData);
          toast.success('Login successful!');
          return userData;
        } catch (error) {
          console.error('Login error:', error);
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
          await authAPI.logout();
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
          const userData = await authAPI.updateProfile(updates);
          set({
            user: userData,
            loading: false,
            error: null,
          });
          toast.success('Profile updated successfully!');
          return userData;
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

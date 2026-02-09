import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { authService } from '../services/firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  userProfile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setUserProfile: (profile: any) => void;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      AsyncStorage.setItem('user_uid', user.uid);
    } else {
      AsyncStorage.removeItem('user_uid');
    }
  },

  setUserProfile: (profile) => {
    set({ userProfile: profile });
    if (profile) {
      AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    }
  },

  signOut: async () => {
    await authService.signOut();
    await AsyncStorage.multiRemove(['user_uid', 'user_profile', 'auth_token']);
    set({ user: null, userProfile: null, isAuthenticated: false });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const profile = await authService.getUserProfile(currentUser.uid);
        set({
          user: currentUser,
          userProfile: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },
}));

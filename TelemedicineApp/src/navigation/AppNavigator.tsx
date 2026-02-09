import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/firebase/auth';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isAuthenticated, initializeAuth, setUser, setUserProfile } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setUserProfile, initializeAuth]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated && user ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

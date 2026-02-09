import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/firebase/auth';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setUserProfile } = useAuthStore();

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with Firebase
      const user = await authService.signIn(email.trim(), password);
      
      // Get Firebase token and login to backend for MongoDB user data
      const token = await user.getIdToken();
      const backendUser = await authAPI.login(token);
      
      setUser(user);
      setUserProfile(backendUser.data || backendUser);
      
      // Navigation will be handled by AppNavigator based on auth state
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>Telemedicine</Text>
          <Text style={styles.appSubtitle}>Book doctors in seconds</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Welcome back, please login to continue</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email-outline"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            error={error && !email.trim() ? 'Email is required' : undefined}
          />

          <Input
            label="Password"
            placeholder="Your password"
            leftIcon="lock-outline"
            isPassword
            secureToggle
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            error={error && !password.trim() ? 'Password is required' : undefined}
          />

          <View style={styles.rowBetween}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button title="Sign In" onPress={onLogin} loading={loading} />

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.bottomLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  appSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textLight,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  forgot: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  bottomText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 4,
  },
  bottomLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;

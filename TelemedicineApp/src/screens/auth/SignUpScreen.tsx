import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/firebase/auth';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser, setUserProfile } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Invalid email format';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignUp = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Create Firebase user
      const user = await authService.signUp(
        email.trim(),
        password,
        name.trim(),
        `+91${phone.trim()}`
      );

      // 2. Calculate dateOfBirth (approximate from age or use default)
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 25); // Default to 25 years old

      // 3. Register in MongoDB via backend API
      await authAPI.register({
        firebaseUid: user.uid,
        role: 'patient',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: `+91${phone.trim()}`,
        dateOfBirth,
        gender: 'other', // Default, can be added to form later
        address: {
          city: '',
          state: 'Punjab',
        },
      });

      // 4. Get backend user data
      const token = await user.getIdToken();
      const backendUser = await authAPI.login(token);

      setUser(user);
      setUserProfile(backendUser.data || backendUser);

      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by AppNavigator
    } catch (err: any) {
      console.error('Sign up error:', err);
      const errorMessage =
        err.code === 'auth/email-already-in-use'
          ? 'This email is already registered'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak'
          : err.response?.data?.message || err.message || 'Sign up failed. Please try again.';
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start booking doctor appointments</Text>

      <Input
        label="Full Name"
        placeholder="Enter your name"
        leftIcon="account-outline"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setErrors((prev) => ({ ...prev, name: '' }));
        }}
        error={errors.name}
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={errors.email}
      />

      <Input
        label="Phone"
        placeholder="10-digit number"
        keyboardType="phone-pad"
        leftIcon="phone-outline"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setErrors((prev) => ({ ...prev, phone: '' }));
        }}
        error={errors.phone}
      />

      <Input
        label="Password"
        placeholder="Minimum 8 characters"
        leftIcon="lock-outline"
        isPassword
        secureToggle
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        }}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter your password"
        leftIcon="lock-outline"
        isPassword
        secureToggle
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }}
        error={errors.confirmPassword}
      />

      <Button title="Sign Up" onPress={onSignUp} loading={loading} />

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <Text style={styles.bottomLink} onPress={() => navigation.navigate('Login')}>
          Sign In
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
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

export default SignUpScreen;

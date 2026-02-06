import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const COLORS = {
  primary: '#2563EB',
  background: '#F8FAFC',
  text: '#1E293B',
};

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const remember = await AsyncStorage.getItem('@rememberMe');
        const savedEmail = await AsyncStorage.getItem('@savedEmail');
        if (remember === 'true' && savedEmail) {
          setRememberMe(true);
          setEmail(savedEmail);
        }
      } catch (error) {
        // ignore
      }
    };
    loadRemembered();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFriendlyError = (code, message) => {
    if (code === 'auth/user-not-found') {
      return 'No account found with this email.';
    }
    if (code === 'auth/wrong-password') {
      return 'Incorrect password. Please try again.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Please check your internet connection.';
    }
    return message || 'Something went wrong. Please try again.';
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Sign in with Firebase
      await firebase
        .auth()
        .signInWithEmailAndPassword(email.trim(), password);

      if (rememberMe) {
        await AsyncStorage.setItem('@rememberMe', 'true');
        await AsyncStorage.setItem('@savedEmail', email.trim());
      } else {
        await AsyncStorage.removeItem('@rememberMe');
        await AsyncStorage.removeItem('@savedEmail');
      }

      // Navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      const friendly = getFriendlyError(error.code, error.message);
      Alert.alert('Sign In Error', friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          extraScrollHeight={40}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue booking consultations and accessing your health records.
          </Text>

          <CustomInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            iconName="email"
            returnKeyType="next"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            iconName="lock"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            error={errors.password}
          />

          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                thumbColor={rememberMe ? '#FFFFFF' : '#E5E7EB'}
                trackColor={{ false: '#CBD5F5', true: '#2563EB' }}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
          </View>

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
          />

          <Text style={styles.footerText}>
            New to Kuldeep Sehat?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.replace('Register')}
            >
              Create an account
            </Text>
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#4B5563',
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default SignInScreen;


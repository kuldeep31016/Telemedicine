import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../config/firebase';
import { authAPI } from '../services/api';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const COLORS = {
  primary: '#2563EB',
  background: '#F8FAFC',
  text: '#1E293B',
  error: '#EF4444',
  success: '#10B981',
};

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);
  const villageRef = useRef(null);
  const districtRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!age.trim()) {
      newErrors.age = 'Age is required';
    } else if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!gender) newErrors.gender = 'Gender is required';
    if (!village.trim()) newErrors.village = 'Village/City is required';
    if (!district.trim()) newErrors.district = 'District is required';

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFriendlyError = (code, message) => {
    if (code === 'auth/email-already-in-use') {
      return 'This email is already registered. Please sign in.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/weak-password') {
      return 'Password is too weak. Use at least 8 characters.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Please check your internet connection.';
    }
    return message || 'Something went wrong. Please try again.';
  };

  const withTimeout = (promise, ms, label = 'request') => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${label} timed out`));
      }, ms);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });
  };

  const ageToDateOfBirthISO = (ageNumber) => {
    // Backend requires dateOfBirth (Date). We only collect age in UI.
    // Approximate DOB: Jan 1 of (currentYear - age).
    const now = new Date();
    const year = now.getFullYear() - ageNumber;
    const dob = new Date(year, 0, 1);
    return dob.toISOString();
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      console.log('📝 Register: creating Firebase user...');
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(email.trim(), password);

      const uid = user.uid;
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = `+91${phoneNumber.trim()}`;
      const normalizedGender = (gender || 'Male').toLowerCase(); // male/female/other
      const ageNumber = Number(age);
      const dateOfBirth = ageToDateOfBirthISO(ageNumber);

      console.log('📝 Register: saving profile to Firestore...');
      await withTimeout(
        firebase.firestore().collection('users').doc(uid).set({
          fullName: fullName.trim(),
          phoneNumber: normalizedPhone,
          email: normalizedEmail,
          age: age.trim(),
          gender,
          village: village.trim(),
          district: district.trim(),
          state: 'Punjab',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          userType: 'patient',
          firebaseUid: uid,
        }),
        12000,
        'Firestore save',
      );

      console.log('📝 Register: registering patient in MongoDB via backend...');
      // Backend route is /api/v1/auth/register (see backend/src/routes/index.js)
      // It requires firebaseUid, role, and patient schema requires dateOfBirth.
      await withTimeout(
        authAPI.register({
          firebaseUid: uid,
          role: 'patient',
          name: fullName.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          dateOfBirth,
          gender: normalizedGender,
          address: {
            city: village.trim(),
            state: 'Punjab',
          },
          district: district.trim(),
        }),
        12000,
        'Backend register',
      );

      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please sign in to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('SignIn'),
          },
        ],
      );
    } catch (error) {
      console.log('❌ Register error:', error?.code, error?.message);

      // If backend/Firestore failed after Firebase account creation,
      // try to clean up the partially created Firebase user to avoid inconsistent state.
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          await currentUser.delete();
        }
      } catch (cleanupError) {
        console.log('Cleanup (delete user) failed:', cleanupError?.message);
      }

      const friendly = getFriendlyError(error.code, error.message);
      const message =
        friendly === (error.message || '')
          ? `${friendly}\n\nIf this keeps happening, check API base URL and Firebase config.`
          : friendly;

      Alert.alert('Registration Error', message);
    } finally {
      setLoading(false);
    }
  };

  const GenderOption = ({ label }) => (
    <Text
      onPress={() => {
        setGender(label);
        setErrors((prev) => ({ ...prev, gender: undefined }));
      }}
      style={[
        styles.genderOption,
        gender === label && styles.genderOptionActive,
      ]}
    >
      {label}
    </Text>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          extraScrollHeight={40}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Register as a patient to book consultations and access healthcare services.
          </Text>

          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            iconName="person"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            error={errors.fullName}
          />

          <CustomInput
            label="Phone Number"
            placeholder="10-digit phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="number-pad"
            iconName="phone"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            error={errors.phoneNumber}
          />
          <Text style={styles.helperText}>Prefix +91 will be added automatically</Text>

          <CustomInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            iconName="email"
            returnKeyType="next"
            onSubmitEditing={() => ageRef.current?.focus()}
            error={errors.email}
          />

          <CustomInput
            label="Age"
            placeholder="Your age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            iconName="calendar-today"
            returnKeyType="next"
            onSubmitEditing={() => villageRef.current?.focus()}
            error={errors.age}
          />

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.genderRow}>
              <GenderOption label="Male" />
              <GenderOption label="Female" />
              <GenderOption label="Other" />
            </View>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
          </View>

          <CustomInput
            label="Village / City"
            placeholder="Enter your village or city"
            value={village}
            onChangeText={setVillage}
            iconName="location-city"
            returnKeyType="next"
            onSubmitEditing={() => districtRef.current?.focus()}
            error={errors.village}
          />

          <CustomInput
            label="District"
            placeholder="Enter your district"
            value={district}
            onChangeText={setDistrict}
            iconName="map"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.district}
          />

          <CustomInput
            label="State"
            placeholder="Punjab"
            value="Punjab"
            onChangeText={() => {}}
            iconName="flag"
            editable={false}
          />

          <CustomInput
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
            iconName="lock"
            secureTextEntry={true}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName="lock"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            error={errors.confirmPassword}
          />

          <View style={styles.footer}>
            <CustomButton
              title="Register"
              onPress={handleRegister}
              loading={loading}
            />

            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.replace('SignIn')}
              >
                Sign In
              </Text>
            </Text>
          </View>
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
    marginBottom: 20,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 8,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    color: '#0F172A',
    fontSize: 13,
  },
  genderOptionActive: {
    backgroundColor: '#DBEAFE',
    borderColor: COLORS.primary,
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;


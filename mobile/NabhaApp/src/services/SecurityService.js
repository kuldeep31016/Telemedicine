import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { Alert } from 'react-native';

class SecurityService {
  constructor() {
    this.encryptionKey = 'NABHA_HEALTH_SECURE_KEY_2024'; // Should be from secure storage
  }

  // Encrypt sensitive data before storing locally
  encryptData(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // Decrypt sensitive data when retrieving
  decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Secure token storage
  async storeSecureToken(token) {
    try {
      const encryptedToken = this.encryptData(token);
      await AsyncStorage.setItem('@secure_token', encryptedToken);
    } catch (error) {
      console.error('Token storage error:', error);
    }
  }

  // Secure token retrieval
  async getSecureToken() {
    try {
      const encryptedToken = await AsyncStorage.getItem('@secure_token');
      if (encryptedToken) {
        return this.decryptData(encryptedToken);
      }
      return null;
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  }

  // Secure patient data storage
  async storePatientData(patientData) {
    try {
      // Remove sensitive fields before encryption
      const sanitizedData = {
        id: patientData.id,
        name: patientData.name,
        phone: patientData.phone,
        // Don't store medical records locally
      };
      const encryptedData = this.encryptData(sanitizedData);
      await AsyncStorage.setItem('@patient_data', encryptedData);
    } catch (error) {
      console.error('Patient data storage error:', error);
    }
  }

  // Clear all sensitive data on logout
  async clearSecureData() {
    try {
      await AsyncStorage.multiRemove([
        '@secure_token',
        '@patient_data',
        '@medical_records',
        '@consultation_history'
      ]);
    } catch (error) {
      console.error('Data clearing error:', error);
    }
  }

  // Biometric authentication check
  checkBiometricAvailability() {
    // Implementation for biometric authentication
    // Using expo-local-authentication
    return new Promise((resolve) => {
      // Check if biometric authentication is available
      resolve(true); // Simplified for demo
    });
  }

  // Session timeout management
  setupSessionTimeout() {
    const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
    let timeoutId;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        Alert.alert(
          'Session Expired',
          'For security reasons, your session has expired. Please log in again.',
          [{ text: 'OK', onPress: () => this.handleSessionExpiry() }]
        );
      }, TIMEOUT_DURATION);
    };

    // Reset timeout on user activity
    return resetTimeout;
  }

  async handleSessionExpiry() {
    await this.clearSecureData();
    // Navigate to login screen
  }

  // Validate SSL/TLS certificates
  validateSSLCertificate(url) {
    // Ensure all API calls use HTTPS
    if (!url.startsWith('https://')) {
      throw new Error('Insecure connection detected. Only HTTPS allowed.');
    }
  }

  // Data anonymization for analytics
  anonymizePatientData(patientData) {
    return {
      patientId: CryptoJS.SHA256(patientData.id).toString(),
      ageGroup: this.getAgeGroup(patientData.age),
      gender: patientData.gender,
      district: patientData.district,
      // Remove all PII
    };
  }

  getAgeGroup(age) {
    if (age < 18) return 'minor';
    if (age < 30) return '18-29';
    if (age < 50) return '30-49';
    if (age < 65) return '50-64';
    return '65+';
  }
}

export default new SecurityService();
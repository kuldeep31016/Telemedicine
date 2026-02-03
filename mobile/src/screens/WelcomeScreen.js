import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Kuldeep Sehat</Text>
        <Text style={styles.tagline}>Telemedicine for Rural Punjab</Text>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureRow}>
          <Icon name="medical-services" size={22} color="#2563EB" />
          <Text style={styles.featureText}>Consult expert doctors from anywhere</Text>
        </View>
        <View style={styles.featureRow}>
          <Icon name="sos" size={22} color="#EF4444" />
          <Text style={styles.featureText}>24/7 emergency SOS support</Text>
        </View>
        <View style={styles.featureRow}>
          <Icon name="health-and-safety" size={22} color="#10B981" />
          <Text style={styles.featureText}>Secure health records & reports</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          style={styles.primaryButton}
        />
        <CustomButton
          title="Register"
          onPress={() => navigation.navigate('Register')}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#64748B',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  actions: {
    marginTop: 40,
    gap: 16,
  },
  primaryButton: {},
  secondaryButton: {
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2563EB',
  },
});

export default WelcomeScreen;


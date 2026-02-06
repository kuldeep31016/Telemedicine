import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../config/firebase';

const SplashScreen = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          // User already logged in → go straight to Home
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          return;
        }

        const onboardingCompleted = await AsyncStorage.getItem('@onboardingCompleted');
        if (onboardingCompleted === 'true') {
          navigation.replace('Welcome');
        } else {
          navigation.replace('Onboarding');
        }
      } catch (error) {
        // In case of any issue, fall back to onboarding
        navigation.replace('Onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Kuldeep Sehat</Text>
        <Text style={styles.tagline}>Telemedicine for Rural Punjab</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#E5E7EB',
  },
});

export default SplashScreen;


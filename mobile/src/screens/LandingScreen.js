import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade and slide up animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F2FE" />
      
      {/* Background */}
      <View style={styles.backgroundLayer} />
      
      {/* Logo/Brand Name with Medical Icon */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.brandName}>Kuldeep Sehat</Text>
        <View style={styles.medicalIconContainer}>
          <Icon name="local-hospital" size={20} color="#10B981" />
        </View>
      </Animated.View>

      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }) }],
          },
        ]}
      >
        <Text style={styles.heroHeadingLight}>Your Health,</Text>
        <Text style={styles.heroHeadingBold}>Our Priority</Text>
        
        <Text style={styles.heroSubtitle}>
          Connect with expert doctors{'\n'}anytime, anywhere
        </Text>
      </Animated.View>

      {/* Key Features */}
      <Animated.View
        style={[
          styles.featuresSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="access-time" size={24} color="#1E40AF" />
          </View>
          <Text style={styles.featureText}>24/7 Available</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="verified-user" size={24} color="#1E40AF" />
          </View>
          <Text style={styles.featureText}>Secure & Private</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <Icon name="medical-services" size={24} color="#1E40AF" />
          </View>
          <Text style={styles.featureText}>Expert Doctors</Text>
        </View>
      </Animated.View>

      {/* CTA Button - Bottom */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideUpAnim },
              { scale: Animated.multiply(buttonScale, pulseAnim) }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Welcome')}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.ctaText}>Get Started</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  medicalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  heroHeadingLight: {
    fontSize: 48,
    fontWeight: '400',
    color: '#0F172A',
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroHeadingBold: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#475569',
    marginTop: 32,
    lineHeight: 26,
  },
  featuresSection: {
    paddingHorizontal: 32,
    paddingBottom: 28,
    paddingTop: 8,
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  ctaButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default LandingScreen;

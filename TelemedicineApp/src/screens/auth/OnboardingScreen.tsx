import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const slides = [
  {
    title: 'Consult Expert Doctors',
    subtitle: 'Video and in-person consultations from the comfort of your home.',
  },
  {
    title: '24/7 Healthcare Access',
    subtitle: 'Book appointments anytime and keep your medical history in one place.',
  },
  {
    title: 'Smart Reminders',
    subtitle: 'Never miss a follow-up or prescription refill again.',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);

  const goNext = () => {
    if (index < slides.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary]}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          if (idx !== index) setIndex(idx);
        }}
      >
        {slides.map(slide => (
          <View key={slide.title} style={styles.slide}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              style={[styles.dot, index === i && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextText}>
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  topRow: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  skip: {
    color: colors.white,
    fontSize: 14,
  },
  slide: {
    width,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.white,
  },
  nextButton: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  nextText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;


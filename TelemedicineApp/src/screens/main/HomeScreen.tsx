import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

const specialties = [
  { id: '1', name: 'Cardiology', icon: 'heart-pulse' },
  { id: '2', name: 'Paediatrics', icon: 'baby-face-outline' },
  { id: '3', name: 'Urology', icon: 'kidney-outline' },
  { id: '4', name: 'Oncology', icon: 'molecule' },
  { id: '5', name: 'Dermatology', icon: 'lotion-outline' },
];

const recentDoctors = [
  {
    id: '1',
    name: 'Dr. Weber Micheal',
    specialty: 'Neurology Specialist',
    experience: '5+ years',
    rating: 5.0,
    reviews: 1120,
    image: 'https://via.placeholder.com/80',
  },
  {
    id: '2',
    name: 'Dr. John Smith',
    specialty: 'Radiology Specialist',
    experience: '8+ years',
    rating: 4.8,
    reviews: 890,
    image: 'https://via.placeholder.com/80',
  },
];

const HomeScreen: React.FC = () => {
  const { user, userProfile } = useAuthStore();
  const [bannerIndex, setBannerIndex] = useState(0);

  const userName = userProfile?.name || user?.displayName || 'Guest';
  const firstName = userName.split(' ')[0];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="account" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.hello}>Hello</Text>
              <Text style={styles.name}>{firstName}!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Icon name="dots-grid" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textLight} />
          <View style={styles.searchTextContainer}>
            <Text style={styles.searchPlaceholder}>Looking for Doctors?</Text>
            <Text style={styles.searchSubtext}>Search by name or department</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>15% EXTRA DISCOUNT</Text>
              <Text style={styles.bannerSubtitle}>
                Get your first consultation absolutely free!
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Get Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerImage}>
              <Icon name="doctor" size={80} color={colors.white} />
            </View>
          </View>
          <View style={styles.bannerDots}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  bannerIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}
          >
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={styles.specialtyCard}
              >
                <View style={styles.specialtyIcon}>
                  <Icon name={specialty.icon} size={32} color={colors.primary} />
                </View>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* My Recent Visit */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recent Visit</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorsContainer}
          >
            {recentDoctors.map((doctor) => (
              <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                <Image
                  source={{ uri: doctor.image }}
                  style={styles.doctorImage}
                />
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>
                    {doctor.rating} ({doctor.reviews})
                  </Text>
                </View>
                <View style={styles.specialtyBadge}>
                  <Icon name="brain" size={12} color={colors.white} />
                  <Text style={styles.specialtyBadgeText}>
                    {doctor.specialty} • {doctor.experience}
                  </Text>
                </View>
                <TouchableOpacity style={styles.bookButton}>
                  <Icon name="calendar-plus" size={16} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* My Checkup Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Checkup Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleContent}>
              <Icon name="hospital-building" size={24} color={colors.primary} />
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleTitle}>Clinic Visit</Text>
                <Text style={styles.scheduleDate}>Tomorrow, 10:00 AM</Text>
              </View>
            </View>
          </View>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleContent}>
              <Icon name="hospital-building" size={24} color={colors.primary} />
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleTitle}>Clinic Visit</Text>
                <Text style={styles.scheduleDate}>Feb 10, 2:00 PM</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  hello: {
    fontSize: 14,
    color: colors.textLight,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchTextContainer: {
    marginLeft: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  bannerContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  bannerButton: {
    backgroundColor: colors.primaryLighter,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  bannerImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  specialtiesContainer: {
    paddingRight: spacing.lg,
  },
  specialtyCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  specialtyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLighter + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  specialtyName: {
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  doctorsContainer: {
    paddingRight: spacing.lg,
  },
  doctorCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
    alignSelf: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  specialtyBadgeText: {
    fontSize: 10,
    color: colors.white,
    marginLeft: 4,
    fontWeight: '600',
  },
  bookButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLighter + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  scheduleCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    marginLeft: spacing.md,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  scheduleDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default HomeScreen;

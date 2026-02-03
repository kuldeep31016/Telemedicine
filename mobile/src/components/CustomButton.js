import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';

// Primary color palette for auth UI
const COLORS = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  disabled: '#93C5FD',
  textOnPrimary: '#FFFFFF',
};

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.buttonContainer, style, isDisabled && styles.buttonDisabled]}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.textOnPrimary} />
        ) : (
          <View style={styles.content}>
            {leftIcon ? <View style={styles.iconWrapper}>{leftIcon}</View> : null}
            <Text style={[styles.title, textStyle]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});

export default CustomButton;


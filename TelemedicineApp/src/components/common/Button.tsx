import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.white
      : 'transparent';

  const borderWidth = variant === 'outline' ? 1 : 0;
  const borderColor = variant === 'outline' ? colors.primary : 'transparent';
  const textColor =
    variant === 'primary' ? colors.white : variant === 'secondary' ? colors.primary : colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderWidth, borderColor, opacity: isDisabled ? 0.6 : 1 },
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;


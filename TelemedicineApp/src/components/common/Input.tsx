import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  secureToggle?: boolean;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  secureToggle,
  isPassword,
  value,
  onChangeText,
  ...rest
}) => {
  const [hidden, setHidden] = React.useState<boolean>(!!isPassword);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          !!error && { borderColor: colors.error },
        ]}
      >
        {leftIcon ? (
          <Icon
            name={leftIcon}
            size={20}
            color={error ? colors.error : colors.textLight}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isPassword && hidden}
          {...rest}
        />

        {secureToggle && isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden(prev => !prev)}
            style={styles.rightIcon}
          >
            <Icon
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 4,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});

export default Input;


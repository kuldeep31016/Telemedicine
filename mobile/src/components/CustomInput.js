import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#2563EB',
  border: '#E2E8F0',
  text: '#1E293B',
  placeholder: '#94A3B8',
  error: '#EF4444',
  background: '#FFFFFF',
};

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  iconName,
  error,
  returnKeyType = 'next',
  onSubmitEditing,
  blurOnSubmit = false,
  editable = true,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          !!error && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        {iconName ? (
          <Icon
            name={iconName}
            size={20}
            color={error ? COLORS.error : COLORS.primary}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          editable={editable}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={styles.rightIcon}
          >
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={20}
              color={COLORS.placeholder}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputWrapperDisabled: {
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 10,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.error,
  },
});

export default CustomInput;


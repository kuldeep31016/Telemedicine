import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onReset = async () => {
    // TODO: call Firebase sendPasswordResetEmail
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email-outline"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Send Reset Link" onPress={onReset} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});

export default ForgotPasswordScreen;


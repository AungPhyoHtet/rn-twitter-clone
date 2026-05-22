import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const FieldError = ({ message }: { message?: string }) =>
  message ? <Text style={styles.errorText}>{message}</Text> : null;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const { login, errors, errorMessage, clearErrors } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      clearErrors();
      setFieldErrors({ email: '', password: '' });
    }, [clearErrors]),
  );

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  function handleLogin() {
    const trimmedEmail = email.trim();
    const next = {
      email: !trimmedEmail
        ? 'Email is required.'
        : !isValidEmail(trimmedEmail)
          ? 'Please enter a valid email address.'
          : '',
      password: password.trim() ? '' : 'Password is required.',
    };
    setFieldErrors(next);
    if (next.email || next.password) return;
    login(email, password, () => setPassword(''));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>RN Demo</Text>
        <Text style={styles.title}>Log in to your account</Text>

        {errorMessage && Object.keys(errors).length === 0 && (
          <View style={styles.errorBanner}>
            <FieldError message={errorMessage} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
          />
          <FieldError message={fieldErrors.email || errors.email?.[0]} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            textContentType="password"
            secureTextEntry
            returnKeyType="done"
            autoCapitalize="none"
          />
          <FieldError message={fieldErrors.password || errors.password?.[0]} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DA1F2',
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4,
  },
  forgotPassword: {
    color: '#1DA1F2',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#1DA1F2',
    fontSize: 14,
    fontWeight: '600',
  },
});

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

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type FieldErrors = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const emptyErrors: FieldErrors = {
  name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyErrors);
  const { register, errors, errorMessage, clearErrors } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      clearErrors();
      setFieldErrors(emptyErrors);
    }, [clearErrors]),
  );

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function handleRegister() {
    const { name, email, username, password, confirmPassword } = form;
    const next: FieldErrors = {
      name: name.trim() ? '' : 'Name is required.',
      email: !email.trim()
        ? 'Email is required.'
        : !isValidEmail(email.trim())
          ? 'Please enter a valid email address.'
          : '',
      username: username.trim() ? '' : 'Username is required.',
      password: password.trim() ? '' : 'Password is required.',
      confirmPassword: !confirmPassword.trim()
        ? 'Please confirm your password.'
        : confirmPassword !== password
          ? 'Passwords do not match.'
          : '',
    };
    setFieldErrors(next);
    if (Object.values(next).some(Boolean)) return;
    register(name, email, username, password, confirmPassword, () =>
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' })),
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>RN Demo</Text>
        <Text style={styles.title}>Create your account</Text>

        {errorMessage && Object.keys(errors).length === 0 && (
          <View style={styles.errorBanner}>
            <FieldError message={errorMessage} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={set('name')}
            value={form.name}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            textContentType="name"
            returnKeyType="next"
            autoCapitalize="words"
          />
          <FieldError message={fieldErrors.name || errors.name?.[0]} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={set('email')}
            value={form.email}
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
            onChangeText={set('username')}
            value={form.username}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            textContentType="username"
            returnKeyType="next"
            autoCapitalize="none"
          />
          <FieldError message={fieldErrors.username || errors.username?.[0]} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={set('password')}
            value={form.password}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            textContentType="password"
            secureTextEntry
            returnKeyType="next"
            autoCapitalize="none"
          />
          <FieldError message={fieldErrors.password || errors.password?.[0]} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={set('confirmPassword')}
            value={form.confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            textContentType="password"
            secureTextEntry
            returnKeyType="done"
            autoCapitalize="none"
          />
          <FieldError message={fieldErrors.confirmPassword} />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 32 },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DA1F2',
    textAlign: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 24 },
  errorBanner: { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12, marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
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
  errorText: { color: '#ef4444', fontSize: 13, marginTop: 4 },
  registerButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#6b7280', fontSize: 14 },
  loginLink: { color: '#1DA1F2', fontSize: 14, fontWeight: '600' },
});

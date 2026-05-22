import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
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

  function handleLogin() {
    const next = {
      email: email.trim() ? '' : 'Email is required.',
      password: password.trim() ? '' : 'Password is required.',
    };
    setFieldErrors(next);
    if (next.email || next.password) return;
    login(email, password, () => setPassword(''));
  }

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address"
        placeholderTextColor="gray"
        textContentType="emailAddress"
        keyboardType="email-address"
        returnKeyType="next"
        autoCapitalize="none"
      />
      <FieldError message={fieldErrors.email || errors.email?.[0]} />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        placeholderTextColor="gray"
        textContentType="password"
        secureTextEntry
        returnKeyType="done"
        autoCapitalize="none"
      />
      <FieldError message={fieldErrors.password || errors.password?.[0]} />
      {errorMessage && Object.keys(errors).length === 0 && <FieldError message={errorMessage} />}
      <Button onPress={handleLogin} title="Log In" />
      <Button onPress={() => navigation.navigate('Register')} title="Register" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: 'red' },
});

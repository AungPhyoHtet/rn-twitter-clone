import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

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
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        placeholderTextColor="gray"
        textContentType="emailAddress"
        returnKeyType="done"
      />
      <Button onPress={() => login(email, password)} title="Log In" />

      <Button onPress={() => navigation.navigate('Register')} title="Register" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {},
});

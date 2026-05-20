import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthProvider';

export default function SettingsScreen() {
  const { logout } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}

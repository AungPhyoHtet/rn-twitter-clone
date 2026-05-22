import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/Home';
import NewTweetScreen from './screens/NewTweet';
import TweetScreen from './screens/Tweet';
import ProfileScreen from './screens/Profile';
import SearchScreen from './screens/Search';
import NotificationsScreen from './screens/Notifications';
import { RootStackParamList } from './types';
import SettingsScreen from './screens/Settings';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { AuthContext } from './context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './screens/Auth/Login';
import RegisterScreen from './screens/Auth/Register';
import ForgotPasswordScreen from './screens/Auth/ForgotPassword';

import * as SecureStore from 'expo-secure-store';
import axiosConfig from './helpers/axiosConfig';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          title: 'Home',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Stack.Screen name="NewTweet" component={NewTweetScreen} options={{ title: '' }} />
      <Stack.Screen name="Tweet" component={TweetScreen} options={{ title: '' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="search" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="bell" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    Promise.all([SecureStore.getItemAsync('user'), SecureStore.getItemAsync('token')])
      .then(([userString, token]) => {
        if (userString && token) {
          const parsedUser = JSON.parse(userString);
          if (parsedUser?.id) {
            setUser(parsedUser);
            axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            SecureStore.deleteItemAsync('user');
            SecureStore.deleteItemAsync('token');
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [setUser]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Main">
            <Drawer.Screen
              name="Main"
              component={HomeStackNavigator}
              options={{ headerShown: false, drawerLabel: 'Home' }}
            />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}

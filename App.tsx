import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/Home';
import NewTweetScreen from './screens/NewTweet';
import TweetScreen from './screens/Tweet';
import ProfileScreen from './screens/Profile';
import SearchScreen from './screens/Search';
import NotificationsScreen from './screens/Notifications';
import { RootStackParamList } from './screens/types';
import SettingsScreen from './screens/Settings';

import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      screenListeners={({ navigation, route }) => ({
        focus: () => {
          navigation.getParent()?.setOptions({
            headerShown: route.name === 'Tab',
          });
        },
      })}
    >
      <Stack.Screen
        name="Tab"
        component={TabNavigator}
        options={{ headerShown: false, title: '' }}
      />
      <Stack.Screen name="NewTweet" component={NewTweetScreen} options={{ title: '' }} />
      <Stack.Screen name="Tweet" component={TweetScreen} options={{ title: '' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '' }} />
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
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Drawer.Screen name="Home" component={HomeStackNavigator} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

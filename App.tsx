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
      <Drawer.Navigator initialRouteName="Main">
        <Drawer.Screen
          name="Main"
          component={HomeStackNavigator}
          options={{ headerShown: false, drawerLabel: 'Home' }}
        />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

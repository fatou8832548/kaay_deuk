import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import ListingsScreen from '../screens/ListingsScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Heart, Calendar, User, Settings2 } from 'lucide-react-native';
import ReservationPaymentScreen from '../screens/ReservationPaymentScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import VirtualTourScreen from '../screens/VirtualTourScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function MainTabNavigator({ onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs">
          {() => (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderTopWidth: 0,
                  elevation: 10,
                  height: 68,
                },
                tabBarIcon: ({ color, size }) => {
                  if (route.name === 'Home') return <Home color={color} size={size} />;
                  if (route.name === 'Favoris') return <Heart color={color} size={size} />;
                  if (route.name === 'Réservation') return <Calendar color={color} size={size} />;
                  if (route.name === 'Profil') return <User color={color} size={size} />;
                  if (route.name === 'Paramètres') return <Settings2 color={color} size={size} />;
                  return null;
                },
                tabBarActiveTintColor: '#3B2A1B',
                tabBarInactiveTintColor: '#6E6258',
                tabBarLabelStyle: {
                  fontSize: 10,
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Favoris" component={FavoritesScreen} />
              <Tab.Screen name="Profil">
                {() => <ProfileScreen onLogout={onLogout} />}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="Paramètres" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ReservationPaymentScreen" component={ReservationPaymentScreen} />
        <Stack.Screen name="PropertyDetailScreen" component={PropertyDetailScreen} />
        <Stack.Screen name="ReservationScreen" component={ReservationScreen} />
        <Stack.Screen name="VirtualTourScreen" component={VirtualTourScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

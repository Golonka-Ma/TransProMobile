import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MessagesStack from './MessagesStack';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Messages') {
            iconName = 'chatbubbles';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // Dark background for the tab bar
          borderTopColor: '#333', // Subtle border color
        },
        tabBarActiveTintColor: '#007ACC', // Active tab color
        tabBarInactiveTintColor: '#888', // Inactive tab color
        headerShown: false, // Hide headers for tabs
      })}
    >
      {/* Home Screen Tab */}
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      {/* Messages Tab */}
      <Tab.Screen name="Messages" component={MessagesStack} />
    </Tab.Navigator>
  );
}

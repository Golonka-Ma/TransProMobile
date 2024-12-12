import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F1E16' }, // Dark background for the header
        headerTitleStyle: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, // White text for the header
        headerTintColor: '#007ACC', // Accent color for back button and icons
      }}
    >
      {/* Login Screen */}
      <Stack.Screen name=" ">
        {props => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

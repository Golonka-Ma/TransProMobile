// src/navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

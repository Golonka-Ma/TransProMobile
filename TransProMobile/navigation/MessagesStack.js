import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserList from '../screens/UserList';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' }, // Dark header background
        headerTitleStyle: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, // White header text
        headerTintColor: '#007ACC', // Accent color for back button and icons
      }}
    >
      {/* User List Screen */}
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{
          title: 'Użytkownicy', // Title displayed in the header
        }}
      />
      
      {/* Chat Screen */}
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: `Czat z ${route.params.username}`, // Dynamic title based on the username
        })}
      />
    </Stack.Navigator>
  );
}

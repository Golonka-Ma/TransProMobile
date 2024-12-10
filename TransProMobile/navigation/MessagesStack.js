import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserList from '../screens/UserList';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserList" component={UserList} options={{ title: 'Użytkownicy' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.username })} />
    </Stack.Navigator>
  );
}

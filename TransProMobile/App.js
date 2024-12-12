import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme as DarkTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import { getToken, clearToken } from './services/auth';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    async function checkToken() {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setIsLoading(false); // Set loading to false after the check
    }
    checkToken();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    await clearToken();
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007ACC" />
      </View>
    );
  }

  return (
    <PaperProvider theme={DarkTheme}>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainTabs onLogout={handleLogout} />
        ) : (
          <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Match the app's dark theme
  },
});

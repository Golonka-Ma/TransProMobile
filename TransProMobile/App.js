// App.js
import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import { getToken, clearToken } from './services/auth';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
      }
    })();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    setIsLoggedIn(false);
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        {isLoggedIn ? <MainTabs onLogout={handleLogout} /> : <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />}
      </NavigationContainer>
    </PaperProvider>
  );
}

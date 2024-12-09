// App.js
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import { getToken, clearToken } from './services/auth';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) setIsLoggedIn(true);
    })();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    setIsLoggedIn(false);
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs onLogout={handleLogout} /> : <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />}
    </NavigationContainer>
  );
}

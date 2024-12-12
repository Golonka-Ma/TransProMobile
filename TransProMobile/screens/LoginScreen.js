import React, { useState } from 'react';
import { View, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { Card, Text, TextInput, Button, Checkbox } from 'react-native-paper';
import api from '../services/api';
import { saveToken, saveUsername } from '../services/auth';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Błąd', 'Proszę wprowadzić nazwę użytkownika i hasło.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, username: loggedInUsername } = response.data;
      await saveToken(token);
      await saveUsername(loggedInUsername);
      console.log('Zalogowano użytkownika:', loggedInUsername);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error', error);
      Alert.alert('Błąd', 'Nieprawidłowa nazwa użytkownika lub hasło.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/bg.png')} // Replace with your bg.png path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Login Card */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')} // Replace with your logo.png path
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Welcome Message */}
            <Text style={styles.welcomeTitle}>Witamy z powrotem!</Text>
            <Text style={styles.subtitle}>Zaloguj się do swojego konta</Text>

            {/* Username Input */}
            <TextInput
              mode="outlined"
              label="Nazwa użytkownika"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              autoCapitalize="none"
            />

            {/* Password Input */}
            <TextInput
              mode="outlined"
              label="Hasło"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon="eye" />}
            />

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              disabled={loading}
            >
              <Text style={styles.ButtonText}>Zaloguj</Text>
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '95%',
    backgroundColor: 'rgba(15, 37, 28, 1)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 170,
    height: 80,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#333',
    marginLeft: 8,
  },
  forgotPassword: {
    color: '#1D4B3D',
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 15,
    backgroundColor: '#1D4B3D',
  },
  buttonContent: {
    paddingVertical: 4,
  },
  ButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

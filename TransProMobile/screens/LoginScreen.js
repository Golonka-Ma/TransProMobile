import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { saveToken, saveUsername } from '../services/auth';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  async function handleLogin() {
    try {
      const response = await api.post('/api/auth/login', {username, password});
      const { token, username: loggedInUsername } = response.data;
      await saveToken(token);
      await saveUsername(loggedInUsername); // Zapisz nazwę użytkownika
      console.log('Zalogowano użytkownika:', loggedInUsername);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error', error);
      Alert.alert('Błąd', 'Nieprawidłowa nazwa użytkownika lub hasło.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zaloguj się</Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa użytkownika"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Zaloguj" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff'},
  title:{fontSize:24, marginBottom:20, textAlign:'center', color:'#333'},
  input:{
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    marginBottom:10,
    borderRadius:5
  }
});

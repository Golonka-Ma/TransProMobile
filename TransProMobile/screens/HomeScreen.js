// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function HomeScreen({ onLogout }) {
  const handlePressLogout = () => {
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witaj na ekranie głównym!</Text>
      <Button mode="contained" onPress={handlePressLogout} style={styles.button}>
        Wyloguj
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2E2E2E'},
  text: { fontSize: 20, marginBottom: 20 },
  button: { marginTop: 10 },
});

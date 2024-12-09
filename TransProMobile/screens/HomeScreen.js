// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witaj na ekranie głównym!</Text>
      <Button title="Wyloguj" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff'},
  text:{fontSize:20, marginBottom:20}
});

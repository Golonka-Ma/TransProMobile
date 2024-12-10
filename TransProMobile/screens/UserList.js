// src/screens/UserList.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { List, Avatar } from 'react-native-paper';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function UserList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const resp = await api.get('/api/users');
      setUsers(resp.data);
    } catch (error) {
      console.error('Błąd podczas ładowania listy użytkowników:', error);
      Alert.alert('Błąd', 'Nie udało się załadować listy użytkowników.');
    } finally {
      setLoading(false);
    }
  }

  function handleUserPress(username) {
    navigation.navigate('Chat', { username });
  }

  function renderUserItem({ item }) {
    return (
      <List.Item
        title={item.username}
        left={() => (
          <Avatar.Text size={40} label={item.username.charAt(0).toUpperCase()} />
        )}
        right={() => <Ionicons name="chevron-forward" size={24} color="#ccc" />}
        onPress={() => handleUserPress(item.username)}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderUserItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 70 },
});

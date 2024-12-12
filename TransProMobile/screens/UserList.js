import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert, Text, ImageBackground } from 'react-native';
import { List, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

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
      console.error('Error loading user list:', error);
      Alert.alert('Error', 'Failed to load the user list.');
    } finally {
      setLoading(false);
    }
  }

  function handleUserPress(username) {
    navigation.navigate('Chat', { username });
  }

  function renderUserItem({ item }) {
    return (
      <Card style={styles.card} onPress={() => handleUserPress(item.username)}>
        <Card.Title
          title={item.username}
          subtitle={item.lastMessage || 'Brak wiadomości'} // Display the last message or fallback text
          titleStyle={styles.username}
          subtitleStyle={styles.lastMessage}
          left={() => (
            <Avatar.Text
              size={48}
              label={item.username.charAt(0).toUpperCase()}
              style={styles.avatar}
              color="#fff"
            />
          )}
          right={() => (
            <Ionicons name="chevron-forward" size={24} color="#888" style={styles.icon} />
          )}
        />
      </Card>
    );
  }

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/bg.png')} // Replace with your bg.png path
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007ACC" />
        </View>
      </ImageBackground>
    );
  }

  if (users.length === 0) {
    return (
      <ImageBackground
        source={require('../assets/bg.png')} // Replace with your bg.png path
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users available.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/bg.png')} // Replace with your bg.png path
      style={styles.background}
      resizeMode="cover"
    >
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
  },
  listContent: {
    flexGrow: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 5,
    elevation: 2,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lastMessage: {
    color: '#ccc',
    fontSize: 14,
  },
  avatar: {
    backgroundColor: '#007ACC',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 10,
  },
  separator: {
    height: 8,
    backgroundColor: 'transparent',
  },
});

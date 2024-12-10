// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Avatar, Card } from 'react-native-paper';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { getToken, getUsername } from '../services/auth';

export default function ChatScreen({ route }) {
  const { username } = route.params; // Użytkownik, z którym rozmawiamy
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef(null);

  useEffect(() => {
    loadCurrentUsername();
    loadChatHistory();
    initWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [username]);

  async function loadCurrentUsername() {
    const uname = await getUsername();
    if (uname) {
      setCurrentUsername(uname);
      console.log('Aktualny użytkownik:', uname);
    } else {
      console.warn('Nie udało się pobrać nazwy użytkownika.');
    }
  }

  async function loadChatHistory() {
    try {
      const resp = await api.get(`/api/messages/${username}`);
      setMessages(resp.data);
    } catch (error) {
      console.error('Błąd podczas ładowania historii czatu:', error);
      Alert.alert('Błąd', 'Nie udało się załadować historii czatu.');
    } finally {
      setLoading(false);
    }
  }

  async function initWebSocket() {
    const token = await getToken();
    const socket = new SockJS('http://192.168.1.19:8080/ws');
    const stompClient = new StompClient({
      webSocketFactory: () => socket,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: frame => {
        console.log('Połączono z WebSocket:', frame);
        stompClient.subscribe('/user/queue/messages', (messageOutput) => {
          const msg = JSON.parse(messageOutput.body);
          console.log('Otrzymano wiadomość:', msg);
          if (selectedUser && (msg.sender.username === selectedUser || msg.receiver.username === selectedUser)) {
            setMessages(prev => [...prev, msg]);
          }
        });
      },
      onStompError: frame => {
        console.log('Błąd STOMP:', frame);
      },
      reconnectDelay: 5000,
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
  }
  

  async function sendMessage() {
    if (!messageContent.trim()) {
      Alert.alert('Błąd', 'Wpisz wiadomość.');
      return;
    }

    const chatMessage = {
      content: messageContent.trim(),
      receiverUsername: username,
      timestamp: new Date(),
    };

    try {
      stompClientRef.current.publish({
        destination: '/app/private-message',
        body: JSON.stringify(chatMessage),
      });
      // Dodaj wiadomość do lokalnego stanu z dynamiczną nazwą użytkownika
      setMessages(prev => [...prev, { ...chatMessage, sender: { username: currentUsername }, receiver: { username } }]);
      setMessageContent('');
      console.log('Wysłano wiadomość:', chatMessage);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      Alert.alert('Błąd', 'Nie udało się wysłać wiadomości.');
    }
  }

  function renderMessageItem({ item }) {
    const isMe = item.sender.username === currentUsername;
    return (
      <View style={[styles.messageContainer, isMe ? styles.me : styles.other]}>
        <Avatar.Text
          size={40}
          label={item.sender.username.charAt(0).toUpperCase()}
          style={isMe ? styles.avatarMe : styles.avatarOther}
        />
        <Card style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={isMe ? styles.textMe : styles.textOther}>{item.sender.username}: {item.content}</Text>
        </Card>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Ładowanie czatu...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messageArea}
      />
      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          placeholder="Wpisz wiadomość..."
          value={messageContent}
          onChangeText={setMessageContent}
          style={styles.input}
        />
        <Button mode="contained" onPress={sendMessage} style={styles.button}>
          Wyślij
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageArea: { padding: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5, alignItems: 'flex-end' },
  me: { justifyContent: 'flex-end' },
  other: { justifyContent: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: '70%' },
  bubbleMe: { backgroundColor: '#3b82f6' },
  bubbleOther: { backgroundColor: '#e5e7eb' },
  textMe: { color: '#fff' },
  textOther: { color: '#111827' },
  avatarMe: { backgroundColor: '#3b82f6', marginLeft: 10 },
  avatarOther: { backgroundColor: '#e5e7eb', marginRight: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' },
  input: { flex: 1, marginRight: 10 },
  button: { paddingHorizontal: 10 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, IconButton, Avatar, Card, Text } from 'react-native-paper';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { getToken, getUsername } from '../services/auth';

export default function ChatScreen({ route }) {
  const { username } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    loadCurrentUsername();
    loadChatHistory();
    initWebSocket();

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [username]);

  async function loadCurrentUsername() {
    const uname = await getUsername();
    setCurrentUsername(uname || 'Anonymous');
  }

  async function loadChatHistory() {
    try {
      const resp = await api.get(`/api/messages/${username}`);
      setMessages(resp.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
      Alert.alert('Error', 'Unable to load chat history.');
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
      onConnect: () => {
        stompClient.subscribe('/user/queue/messages', (messageOutput) => {
          const msg = JSON.parse(messageOutput.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
      reconnectDelay: 5000,
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
  }

  async function sendMessage() {
    if (!messageContent.trim()) {
      Alert.alert('Error', 'Please enter a message.');
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
      setMessageContent('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message.');
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
          <Text style={isMe ? styles.textMe : styles.textOther}>{item.content}</Text>
        </Card>
      </View>
    );
  }

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messageArea}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          placeholder="Type a message..."
          value={messageContent}
          onChangeText={setMessageContent}
          style={styles.inputxx}
          outlineColor="#555"
          activeOutlineColor="#1D4B3D"
        />
        <IconButton
          icon="send"
          size={28}
          onPress={sendMessage}
          style={styles.sendButton}
          iconColor="white"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2E2E2E' },
  messageArea: { padding: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5, alignItems: 'flex-end' },
  me: { justifyContent: 'flex-end' },
  other: { justifyContent: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 15, maxWidth: '70%' },
  bubbleMe: { backgroundColor: '#1D4B3D' },
  bubbleOther: { backgroundColor: '#404040' },
  textMe: { color: '#fff' },
  textOther: { color: '#FFFFFF' },
  avatarMe: { backgroundColor: '#1D4B3D', marginLeft: 10 },
  avatarOther: { backgroundColor: '#404040', marginRight: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  inputxx: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#404040',
    color: '#FFFFFF',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1D4B3D',
    borderRadius: 25,
  },
});

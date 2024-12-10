// src/screens/MessagesScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { getToken, getUsername } from '../services/auth';

export default function MessagesScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const stompClientRef = useRef(null);

  useEffect(() => {
    loadUsers();
    loadCurrentUsername();
    initWebSocket();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  async function loadCurrentUsername() {
    const uname = await getUsername();
    if (uname) {
      setCurrentUsername(uname);
      console.log('Aktualny użytkownik:', uname);
    } else {
      console.warn('Nie udało się pobrać nazwy użytkownika.');
    }
  }

  async function loadUsers() {
    try {
      const resp = await api.get('/api/users');
      setUsers(resp.data);
    } catch (error) {
      console.error('Błąd podczas ładowania listy użytkowników:', error);
      Alert.alert('Błąd', 'Nie udało się załadować listy użytkowników.');
    }
  }

  async function initWebSocket() {
    const token = await getToken();
    const socket = new SockJS('http://192.168.1.19:8080/ws'); // Upewnij się, że adres jest dostępny
    const stompClient = new StompClient({
      webSocketFactory: () => socket,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: frame => {
        console.log('Połączono z WebSocket:', frame);
        stompClient.subscribe('/user/queue/messages', (messageOutput) => {
          const msg = JSON.parse(messageOutput.body);
          console.log('Otrzymano wiadomość:', msg);
          // Sprawdź, czy wiadomość dotyczy wybranego użytkownika
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

  async function selectUserAndLoadMessages(username) {
    setSelectedUser(username);
    try {
      const resp = await api.get(`/api/messages/${username}`);
      setMessages(resp.data);
      console.log('Załadowano historię czatu z', username, ':', resp.data);
    } catch (error) {
      console.error('Błąd podczas ładowania historii czatu:', error);
      Alert.alert('Błąd', 'Nie udało się załadować historii czatu.');
    }
  }

  async function sendMessage() {
    if (!selectedUser || !messageContent.trim()) {
      Alert.alert('Błąd', 'Wybierz użytkownika i wpisz wiadomość.');
      return;
    }
    try {
      const chatMessage = {
        content: messageContent.trim(),
        receiverUsername: selectedUser,
        timestamp: new Date()
      };
      stompClientRef.current.publish({ destination: '/app/private-message', body: JSON.stringify(chatMessage) });
      // Dodaj wiadomość do lokalnego stanu z dynamiczną nazwą użytkownika
      setMessages(prev => [...prev, { ...chatMessage, sender: { username: currentUsername }, receiver: { username: selectedUser } }]);
      setMessageContent('');
      console.log('Wysłano wiadomość:', chatMessage);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      Alert.alert('Błąd', 'Nie udało się wysłać wiadomości.');
    }
  }

  function renderUserItem({ item }) {
    return (
      <TouchableOpacity onPress={() => selectUserAndLoadMessages(item.username)} style={styles.userItem}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{item.username}</Text>
      </TouchableOpacity>
    );
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
        <View style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={isMe ? styles.textMe : styles.textOther}>{item.sender.username}: {item.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userListContainer}>
        <Text style={styles.heading}>Użytkownicy</Text>
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={renderUserItem}
        />
      </View>

      <View style={styles.chatContainer}>
        {selectedUser ? (
          <>
            <Text style={styles.chatHeader}>Czat z {selectedUser}</Text>
            <FlatList
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.messageArea}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Wpisz wiadomość..."
                value={messageContent}
                onChangeText={setMessageContent}
              />
              <Button title="Wyślij" onPress={sendMessage} />
            </View>
          </>
        ) : (
          <Text style={styles.selectUserText}>Wybierz użytkownika z listy po lewej stronie</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, flexDirection:'row' },
  userListContainer: {
    width:'30%',
    borderRightWidth:1,
    borderRightColor:'#ccc',
    padding:10,
    backgroundColor:'#f9f9f9'
  },
  chatContainer: {
    flex:1,
    padding:10,
    backgroundColor:'#fff'
  },
  heading: { fontWeight:'bold', marginBottom:10, fontSize:16 },
  userItem: {
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'#eee',
    flexDirection:'row',
    alignItems:'center'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:'#3b82f6',
    justifyContent:'center',
    alignItems:'center',
    marginRight:10
  },
  avatarText: {
    color:'#fff',
    fontSize:18,
    fontWeight:'bold'
  },
  userName: { fontSize:14 },
  chatHeader: {
    fontWeight:'bold',
    fontSize:18,
    marginBottom:10,
    color:'#333'
  },
  messageArea: {
    flexGrow:1,
    justifyContent:'flex-end'
  },
  messageContainer: {
    flexDirection:'row',
    marginVertical:5
  },
  me: {
    justifyContent:'flex-end'
  },
  other: {
    justifyContent:'flex-start'
  },
  messageBubble: {
    padding:10,
    borderRadius:10,
    maxWidth:'70%'
  },
  bubbleMe: {
    backgroundColor:'#3b82f6'
  },
  bubbleOther: {
    backgroundColor:'#e5e7eb'
  },
  textMe: {
    color:'#fff'
  },
  textOther: {
    color:'#111827'
  },
  avatarMe: { backgroundColor: '#3b82f6', marginLeft: 10 },
  avatarOther: { backgroundColor: '#e5e7eb', marginRight: 10 },
  inputRow: { flexDirection:'row', alignItems:'center', marginTop:10 },
  input: {
    flex:1,
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    marginRight:10,
    borderRadius:5
  },
  selectUserText: {
    fontSize:16,
    color:'#777',
    textAlign:'center',
    marginTop:50
  },
});

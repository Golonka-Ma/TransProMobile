import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { getToken } from '../services/auth';

export default function MessagesScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const stompClientRef = useRef(null);

  useEffect(() => {
    loadUsers();
    initWebSocket();
  }, []);

  async function loadUsers() {
    const resp = await api.get('/api/users');
    setUsers(resp.data);
  }

  async function initWebSocket() {
    const token = await getToken();
    const socket = new SockJS('http://192.168.1.19:8080/ws');
    const stompClient = new StompClient({
      webSocketFactory: () => socket,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: frame => {
        console.log('Połączono z WebSocket');
        stompClient.subscribe('/user/queue/messages', (messageOutput) => {
          const msg = JSON.parse(messageOutput.body);
          if (selectedUser && (msg.sender.username === selectedUser || msg.receiver.username === selectedUser)) {
            setMessages(prev => [...prev, msg]);
          }
        });
      },
      onStompError: frame => {
        console.log('Błąd STOMP', frame);
      }
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
  }

  async function selectUserAndLoadMessages(username) {
    setSelectedUser(username);
    const resp = await api.get(`/api/messages/${username}`);
    setMessages(resp.data);
  }

  function sendMessage() {
    if (!selectedUser || !messageContent.trim()) return;
    const msg = {
      content: messageContent.trim(),
      receiverUsername: selectedUser,
      timestamp: new Date()
    };
    stompClientRef.current.publish({ destination: '/app/private-message', body: JSON.stringify(msg) });
    // Dodaj wiadomość do lokalnego state
    setMessages(prev => [...prev, { ...msg, sender: { username: 'You' }, receiver: {username: selectedUser}}]);
    setMessageContent('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.userListContainer}>
        <Text style={styles.heading}>Użytkownicy</Text>
        <FlatList
          data={users}
          keyExtractor={item=>item.id.toString()}
          renderItem={({item})=>
            <TouchableOpacity onPress={()=>selectUserAndLoadMessages(item.username)} style={styles.userItem}>
              <Text style={styles.userName}>{item.username}</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.chatContainer}>
        {selectedUser ? (
          <>
            <Text style={styles.heading}>Czat z {selectedUser}</Text>
            <FlatList
              data={messages}
              keyExtractor={(item,index)=>index.toString()}
              renderItem={({item})=>{
                const isMe = item.sender.username === 'You';
                return (
                  <View style={[styles.messageBubble, isMe?styles.me:styles.other]}>
                    <Text>{item.sender.username}: {item.content}</Text>
                  </View>
                );
              }}
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
          <Text>Wybierz użytkownika z listy po lewej stronie</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, flexDirection:'row'},
  userListContainer:{
    width:'30%',
    borderRightWidth:1,
    borderRightColor:'#ccc',
    padding:10
  },
  chatContainer:{
    flex:1,
    padding:10
  },
  heading:{fontWeight:'bold', marginBottom:10, fontSize:16},
  userItem:{padding:10, borderBottomWidth:1, borderBottomColor:'#eee'},
  userName:{fontSize:14},
  messageBubble:{
    padding:5,
    marginVertical:3,
    borderRadius:5,
    maxWidth:'70%'
  },
  me:{
    alignSelf:'flex-end',
    backgroundColor:'#3b82f6',
    color:'#fff'
  },
  other:{
    alignSelf:'flex-start',
    backgroundColor:'#e5e7eb',
    color:'#111827'
  },
  inputRow:{flexDirection:'row', alignItems:'center', marginTop:10},
  input:{flex:1, borderWidth:1, borderColor:'#ccc', padding:5, marginRight:10, borderRadius:5}
});

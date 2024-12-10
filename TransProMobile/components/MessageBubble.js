import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, currentUsername }) {
  const isMe = message.sender.username === currentUsername;
  return (
    <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
      <Text style={styles.text}>{message.sender.username}: {message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 5,
    marginVertical: 3,
    borderRadius: 5,
    maxWidth: '70%'
  },
  me: {
    alignSelf:'flex-end',
    backgroundColor:'#3b82f6'
  },
  other: {
    alignSelf:'flex-start',
    backgroundColor:'#e5e7eb'
  },
  text: {
    color:'#111827'
  }
});

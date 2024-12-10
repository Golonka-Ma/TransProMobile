import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function UserListItem({ user, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(user.username)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.username}>{user.username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    alignItems:'center',
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  },
  avatar:{
    width:32,
    height:32,
    borderRadius:16,
    backgroundColor:'#3b82f6',
    alignItems:'center',
    justifyContent:'center',
    marginRight:10
  },
  avatarText:{
    color:'#fff',
    fontWeight:'bold'
  },
  username:{
    fontSize:16
  }
});

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToken(token) {
  await AsyncStorage.setItem('jwtToken', token);
}

export async function getToken() {
  return AsyncStorage.getItem('jwtToken');
}

export async function clearToken() {
  await AsyncStorage.removeItem('jwtToken');
}

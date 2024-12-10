import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToken(token) {
  try {
    await AsyncStorage.setItem('jwtToken', token);
  } catch (e) {
    console.error('Błąd podczas zapisywania tokenu', e);
  }
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    return token;
  } catch (e) {
    console.error('Błąd podczas pobierania tokenu', e);
    return null;
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('username');
  } catch (e) {
    console.error('Błąd podczas usuwania tokenu', e);
  }
}

export async function saveUsername(username) {
  try {
    await AsyncStorage.setItem('username', username);
  } catch (e) {
    console.error('Błąd podczas zapisywania nazwy użytkownika', e);
  }
}

export async function getUsername() {
  try {
    const username = await AsyncStorage.getItem('username');
    return username;
  } catch (e) {
    console.error('Błąd podczas pobierania nazwy użytkownika', e);
    return null;
  }
}

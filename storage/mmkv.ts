import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  USERNAME: 'user.name',
  UID: 'user.uid',
};

/**
 * Menyimpan sesi user saat login
 */
export const setSession = async (username: string, uid: string = '') => {
  try {
    await AsyncStorage.setItem(KEYS.USERNAME, username);
    if (uid) {
      await AsyncStorage.setItem(KEYS.UID, uid);
    }
  } catch (e) {
    console.error('Failed to save session:', e);
  }
};

/**
 * Mengambil data sesi user
 */
export const getSession = async () => {
  try {
    const username = await AsyncStorage.getItem(KEYS.USERNAME);
    const uid = await AsyncStorage.getItem(KEYS.UID);
    
    if (username) {
      return { username, uid };
    }
    return null;
  } catch (e) {
    console.error('Failed to get session:', e);
    return null;
  }
};

/**
 * Menghapus sesi (Logout)
 */
export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USERNAME);
    await AsyncStorage.removeItem(KEYS.UID);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
};

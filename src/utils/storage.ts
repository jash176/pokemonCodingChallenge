import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
export const storage = new MMKV({
  id: 'pokemon-app-storage',
  encryptionKey: 'pokemon-secure-storage-key'
});

// Helper functions for common storage operations
export const StorageUtils = {
  // Store a value with a key
  setItem: (key: string, value: any): void => {
    if (typeof value === 'string') {
      storage.set(key, value);
    } else {
      storage.set(key, JSON.stringify(value));
    }
  },

  // Get a value by key
  getItem: (key: string): any => {
    const value = storage.getString(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      // If it's not JSON, return the string value
      return value;
    }
  },

  // Remove a value by key
  removeItem: (key: string): void => {
    storage.delete(key);
  },

  // Clear all storage
  clearAll: (): void => {
    storage.clearAll();
  }
};
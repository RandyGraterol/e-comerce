// Centralized localStorage management for data persistence

export const STORAGE_KEYS = {
  PRODUCTS: 'simulated_products',
  ORDERS: 'customer_orders',
  LOCKERS: 'customer_lockers',
  CART: 'shopping_cart',
  SEARCH_HISTORY: 'search_history',
  USER_PREFERENCES: 'user_preferences'
} as const;

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Get all keys with a specific prefix
  getKeysByPrefix: (prefix: string): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  },

  // Export all data for backup
  exportAll: (): Record<string, any> => {
    const data: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const value = storage.get(key);
      if (value) {
        data[key] = value;
      }
    });
    return data;
  },

  // Import data from backup
  importAll: (data: Record<string, any>): boolean => {
    try {
      Object.entries(data).forEach(([key, value]) => {
        storage.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};

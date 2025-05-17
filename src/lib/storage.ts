
// --- Storage Keys ---
export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  THEME: 'theme',
  SELECTED_MODEL: 'selectedMode',
  USER_SETTINGS: {
    GENERAL_SETTINGS: {
      THEME: 'userSettings.generalSettings.theme',
      LANGUAGE: 'userSettings.generalSettings.language',
      LAST_UPDATED_TIME: 'userSettings.generalSettings.lastUpdatedTime',
    }
  }
} as const;

// --- Storage Key Map ---
export interface CustomStorageKeyMap {
}

interface BaseStorageKeyMap {
  [STORAGE_KEYS.LANGUAGE]: string;
  [STORAGE_KEYS.THEME]: 'dark' | 'light' | 'system';

  [STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.THEME]: 'dark' | 'light' | 'system';
  [STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE]: string;
  [STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LAST_UPDATED_TIME]: string;


  [STORAGE_KEYS.SELECTED_MODEL]: string;
}
export type StorageKeyMap = BaseStorageKeyMap & CustomStorageKeyMap;

// --- Storage Class ---
export const storage = {
  /**
   * Retrieves a value from storage by key
   * @param key - Storage key to retrieve
   * @returns Promise resolving to the stored value or null if not found
   */
  get: async <K extends keyof StorageKeyMap>(key: K): Promise<StorageKeyMap[K] | null> => {
    try {
      if (chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get(key);
        return result[key] || null;
      } else {
        const result = localStorage.getItem(key);
        return result ? (JSON.parse(result) as StorageKeyMap[K]) : null;
      }
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * Sets a value in storage with the given key
   * @param key - Storage key to set
   * @param value - Value to store
   */
  set: async <K extends keyof StorageKeyMap>(key: K, value: StorageKeyMap[K]): Promise<void> => {
    try {
      if (chrome.storage && chrome.storage.local) {
        const bytesInUseBefore = await chrome.storage.local.getBytesInUse(null);
        await chrome.storage.local.set({ [key]: value });
        // const bytesInUseAfter = await chrome.storage.local.getBytesInUse(null);
        // console.log(`Storage set key: ${key}, usage before: ${bytesInUseBefore}, after: ${bytesInUseAfter}`);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage set error:', key, error);
    }
  },

  /**
   * Removes a value from storage by key
   * @param key - Storage key to remove
   */
  remove: async <K extends keyof StorageKeyMap>(key: K): Promise<void> => {
    try {
      if (chrome.storage && chrome.storage.local) {
        await chrome.storage.local.remove(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage remove error:', key, error);
    }
  },

  /**
   * Clears all data from local storage
   */
  clear: async (): Promise<void> => {
    try {
      if (chrome.storage && chrome.storage.local) {
        await chrome.storage.local.clear();
        console.log('All local storage has been cleared');
      } else {
        localStorage.clear();
        console.log('All local storage has been cleared');
      }
    } catch (error) {
      console.error('Error clearing local storage:', error);
      throw error;
    }
  }
};
/**
 * LocalStorage wrapper with type safety
 */

/**
 * Get item from localStorage
 */
export function getItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage
 */
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clear(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
  RECENT_COLLECTIONS: "recentCollections",
} as const;

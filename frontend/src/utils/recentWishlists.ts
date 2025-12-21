export interface RecentWishlist {
  id: string;
  name: string;
  lastAccessed: string;
}

const RECENT_WISHLISTS_KEY = 'wishlist_recent_lists';
const MAX_RECENT_LISTS = 10;

export const getRecentWishlists = (): RecentWishlist[] => {
  try {
    const stored = localStorage.getItem(RECENT_WISHLISTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent wishlists from local storage:', error);
    return [];
  }
};

export const addToRecentWishlists = (id: string, name: string): void => {
  try {
    const recent = getRecentWishlists();
    
    // Remove if already exists to avoid duplicates
    const updated = recent.filter(wishlist => wishlist.id !== id);
    
    // Add to beginning of array
    updated.unshift({
      id,
      name,
      lastAccessed: new Date().toISOString()
    });
    
    // Keep only the most recent ones
    const limited = updated.slice(0, MAX_RECENT_LISTS);
    
    localStorage.setItem(RECENT_WISHLISTS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving to recent wishlists:', error);
  }
};

export const removeFromRecentWishlists = (id: string): void => {
  try {
    const recent = getRecentWishlists();
    const updated = recent.filter(wishlist => wishlist.id !== id);
    localStorage.setItem(RECENT_WISHLISTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from recent wishlists:', error);
  }
};

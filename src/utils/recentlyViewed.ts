import { ref, computed } from 'vue';
import { getUser } from '@/utils/auth';

interface RecentlyViewedItem {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  viewedAt: string;
}

const recentlyViewed = ref<RecentlyViewedItem[]>([]);

// Local storage key for user recently viewed
const getRecentlyViewedKey = (userId: string) => `recently_viewed_${userId}`;

// Load recently viewed from localStorage
export const loadRecentlyViewed = () => {
  const user = getUser();
  if (!user) return;
  
  const stored = localStorage.getItem(getRecentlyViewedKey(user.id));
  if (stored) {
    recentlyViewed.value = JSON.parse(stored);
  }
};

// Save recently viewed to localStorage
const saveRecentlyViewed = () => {
  const user = getUser();
  if (!user) return;
  
  localStorage.setItem(getRecentlyViewedKey(user.id), JSON.stringify(recentlyViewed.value));
};

// Add movie to recently viewed
export const addToRecentlyViewed = (movie: any) => {
  const user = getUser();
  if (!user) return;
  
  // Remove if already exists to move to top
  const existingIndex = recentlyViewed.value.findIndex(item => item.id === movie.id);
  if (existingIndex > -1) {
    recentlyViewed.value.splice(existingIndex, 1);
  }
  
  const recentItem: RecentlyViewedItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    viewedAt: new Date().toISOString()
  };
  
  // Add to beginning and limit to 20 items
  recentlyViewed.value.unshift(recentItem);
  if (recentlyViewed.value.length > 20) {
    recentlyViewed.value = recentlyViewed.value.slice(0, 20);
  }
  
  saveRecentlyViewed();
};

// Get recently viewed (reactive)
export const getRecentlyViewed = computed(() => recentlyViewed.value);

// Get recently viewed count
export const getRecentlyViewedCount = computed(() => recentlyViewed.value.length);

// Clear recently viewed
export const clearRecentlyViewed = () => {
  const user = getUser();
  if (!user) return;
  
  recentlyViewed.value = [];
  saveRecentlyViewed();
};

// Initialize recently viewed on app start
loadRecentlyViewed();

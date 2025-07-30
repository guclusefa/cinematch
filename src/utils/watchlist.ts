import { ref, computed } from 'vue';
import { getUser } from '@/utils/auth';

interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  addedAt: string;
}

const watchlist = ref<WatchlistItem[]>([]);

// Local storage key for user watchlist
const getWatchlistKey = (userId: string) => `watchlist_${userId}`;

// Load watchlist from localStorage
export const loadWatchlist = () => {
  const user = getUser();
  if (!user) return;
  
  const stored = localStorage.getItem(getWatchlistKey(user.id));
  if (stored) {
    watchlist.value = JSON.parse(stored);
  }
};

// Save watchlist to localStorage
const saveWatchlist = () => {
  const user = getUser();
  if (!user) return;
  
  localStorage.setItem(getWatchlistKey(user.id), JSON.stringify(watchlist.value));
};

// Add movie to watchlist
export const addToWatchlist = (movie: any) => {
  const user = getUser();
  if (!user) return false;
  
  if (isInWatchlist(movie.id)) return false;
  
  const watchlistItem: WatchlistItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    overview: movie.overview,
    addedAt: new Date().toISOString()
  };
  
  watchlist.value.unshift(watchlistItem);
  saveWatchlist();
  return true;
};

// Remove movie from watchlist
export const removeFromWatchlist = (movieId: number) => {
  const user = getUser();
  if (!user) return false;
  
  const index = watchlist.value.findIndex(item => item.id === movieId);
  if (index > -1) {
    watchlist.value.splice(index, 1);
    saveWatchlist();
    return true;
  }
  return false;
};

// Check if movie is in watchlist
export const isInWatchlist = (movieId: number) => {
  const user = getUser();
  if (!user) return false;
  
  return watchlist.value.some(item => item.id === movieId);
};

// Get watchlist (reactive)
export const getWatchlist = computed(() => watchlist.value);

// Get watchlist count
export const getWatchlistCount = computed(() => watchlist.value.length);

// Clear watchlist
export const clearWatchlist = () => {
  const user = getUser();
  if (!user) return;
  
  watchlist.value = [];
  saveWatchlist();
};

// Initialize watchlist on app start
loadWatchlist();

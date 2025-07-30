import { computed } from 'vue';
import { getUser } from '@/utils/auth';

// Get counts for different movie actions
export const getMovieActionsCounts = () => {
  const user = getUser();
  if (!user) {
    return {
      seenCount: 0,
      likedCount: 0,
      lovedCount: 0,
      dislikedCount: 0
    };
  }

  let seenCount = 0;
  let likedCount = 0;
  let lovedCount = 0;
  let dislikedCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes(`_${user.id}_`)) {
      if (key.includes('movie_seen_')) seenCount++;
      else if (key.includes('movie_liked_')) likedCount++;
      else if (key.includes('movie_loved_')) lovedCount++;
      else if (key.includes('movie_disliked_')) dislikedCount++;
    }
  }

  return {
    seenCount,
    likedCount,
    lovedCount,
    dislikedCount
  };
};

// Get all movie IDs for a specific action
export const getMoviesByAction = (action: 'seen' | 'liked' | 'loved' | 'disliked') => {
  const user = getUser();
  if (!user) return [];

  const movieIds: number[] = [];
  const searchKey = `movie_${action}_${user.id}_`;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(searchKey)) {
      const movieId = parseInt(key.replace(searchKey, ''));
      if (!isNaN(movieId)) {
        movieIds.push(movieId);
      }
    }
  }

  return movieIds;
};

// Clear all actions for a user (if needed)
export const clearAllMovieActions = () => {
  const user = getUser();
  if (!user) return;

  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes(`movie_seen_${user.id}_`) ||
      key.includes(`movie_liked_${user.id}_`) ||
      key.includes(`movie_loved_${user.id}_`) ||
      key.includes(`movie_disliked_${user.id}_`)
    )) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
};

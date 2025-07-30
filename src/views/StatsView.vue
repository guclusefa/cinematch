<template>
  <WrapperElement>
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mes Statistiques</h1>
        <p class="text-gray-600 dark:text-gray-400">Découvrez vos habitudes cinématographiques</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Movies in Watchlist -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Ma Liste</p>
              <p class="text-3xl font-bold">{{ watchlistCount }}</p>
            </div>
            <BookmarkIcon class="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <!-- Movies Seen -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Films Vus</p>
              <p class="text-3xl font-bold">{{ movieActionsCounts.seenCount }}</p>
            </div>
            <EyeIcon class="w-12 h-12 text-green-200" />
          </div>
        </div>

        <!-- Movies Liked -->
        <div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm font-medium">Films Aimés</p>
              <p class="text-3xl font-bold">{{ movieActionsCounts.likedCount }}</p>
            </div>
            <HeartIcon class="w-12 h-12 text-red-200" />
          </div>
        </div>

        <!-- Movies Loved -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Coups de Cœur</p>
              <p class="text-3xl font-bold">{{ movieActionsCounts.lovedCount }}</p>
            </div>
            <StarIcon class="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <!-- Ratings Given -->
        <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100 text-sm font-medium">Notes Données</p>
              <p class="text-3xl font-bold">{{ ratingsCount }}</p>
            </div>
            <ChartBarIcon class="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <!-- Average Rating -->
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-100 text-sm font-medium">Note Moyenne</p>
              <p class="text-3xl font-bold">{{ averageRating }}/5</p>
            </div>
            <StarIcon class="w-12 h-12 text-indigo-200" />
          </div>
        </div>

        <!-- Recently Viewed -->
        <div class="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-teal-100 text-sm font-medium">Récemment Vus</p>
              <p class="text-3xl font-bold">{{ recentlyViewedCount }}</p>
            </div>
            <ClockIcon class="w-12 h-12 text-teal-200" />
          </div>
        </div>

        <!-- Movies Disliked -->
        <div class="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-100 text-sm font-medium">Non Aimés</p>
              <p class="text-3xl font-bold">{{ movieActionsCounts.dislikedCount }}</p>
            </div>
            <HandThumbDownIcon class="w-12 h-12 text-gray-200" />
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouterLink
            to="/watchlist"
            class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <BookmarkIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Ma Liste</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Gérer mes films à voir</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/search"
            class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <MagnifyingGlassIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Rechercher</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Trouver de nouveaux films</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/recommendation-ia"
            class="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <SparklesIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">IA Recommandation</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Découvrir avec l'IA</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div v-if="recentActivity.length > 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h3>
        <div class="space-y-3">
          <div
            v-for="activity in recentActivity.slice(0, 5)"
            :key="activity.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <img
              :src="activity.poster_path ? `https://image.tmdb.org/t/p/w92${activity.poster_path}` : '/placeholder-movie.jpg'"
              :alt="activity.title"
              class="w-12 h-16 object-cover rounded"
              @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-movie.jpg'"
            />
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Vu {{ formatDate(activity.viewedAt) }}
              </p>
            </div>
            <RouterLink
              :to="`/movies/${activity.id}`"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Voir
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookmarkIcon, EyeIcon, StarIcon, ChartBarIcon, MagnifyingGlassIcon, SparklesIcon, HeartIcon, HandThumbDownIcon, ClockIcon } from '@heroicons/vue/24/outline';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import { getWatchlistCount, loadWatchlist } from '@/utils/watchlist';
import { getRecentlyViewed, getRecentlyViewedCount, loadRecentlyViewed } from '@/utils/recentlyViewed';
import { getMovieActionsCounts } from '@/utils/movieActions';
import { getUser } from '@/utils/auth';

const user = getUser();

// Load data
loadWatchlist();
loadRecentlyViewed();

const watchlistCount = getWatchlistCount;
const recentlyViewedCount = getRecentlyViewedCount;
const recentActivity = getRecentlyViewed;

// Get movie actions counts
const movieActionsCounts = computed(() => getMovieActionsCounts());

// Calculate ratings statistics from localStorage
const ratingsCount = computed(() => {
  if (!user) return 0;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`movie_rating_${user.id}_`)) {
      count++;
    }
  }
  return count;
});

const averageRating = computed(() => {
  if (!user || ratingsCount.value === 0) return '0.0';
  
  let totalRating = 0;
  let count = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`movie_rating_${user.id}_`)) {
      const rating = localStorage.getItem(key);
      if (rating) {
        totalRating += parseInt(rating);
        count++;
      }
    }
  }
  
  return count > 0 ? (totalRating / count).toFixed(1) : '0.0';
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
  return `il y a ${Math.floor(diffDays / 30)} mois`;
};
</script>

<template>
  <WrapperElement>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ma Liste</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ watchlistCount }} film{{ watchlistCount > 1 ? 's' : '' }} dans votre liste
          </p>
        </div>
        
        <button
          v-if="watchlistCount > 0"
          @click="handleClearWatchlist"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Vider la liste
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="watchlistCount === 0" class="text-center py-16">
        <BookmarkIcon class="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Votre liste est vide
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Ajoutez des films à votre liste pour les retrouver facilement
        </p>
        <RouterLink
          to="/search"
          class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
          Découvrir des films
        </RouterLink>
      </div>

      <!-- Watchlist Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="movie in watchlist"
          :key="movie.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
        >
          <!-- Movie Poster -->
          <div class="relative">
            <RouterLink :to="`/movies/${movie.id}`">
              <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'"
                :alt="movie.title"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-movie.jpg'"
              />
            </RouterLink>
            
            <!-- Remove Button -->
            <button
              @click="removeMovie(movie.id)"
              class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Movie Info -->
          <div class="p-4">
            <RouterLink :to="`/movies/${movie.id}`">
              <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                {{ movie.title }}
              </h3>
            </RouterLink>
            
            <div class="flex items-center gap-2 mb-3">
              <RatingStarsElement :rating="movie.vote_average / 2" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ (movie.vote_average / 2).toFixed(1) }}/5
              </span>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
              {{ movie.overview }}
            </p>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span class="text-xs text-gray-400 dark:text-gray-500">
                Ajouté {{ formatDate(movie.addedAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookmarkIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import RatingStarsElement from '@/components/elements/RatingStarsElement.vue';
import { getWatchlist, getWatchlistCount, removeFromWatchlist, clearWatchlist, loadWatchlist } from '@/utils/watchlist';
import { toast } from 'vue3-toastify';

// Load watchlist on component mount
loadWatchlist();

const watchlist = getWatchlist;
const watchlistCount = getWatchlistCount;

const removeMovie = (movieId: number) => {
  const movie = watchlist.value.find(m => m.id === movieId);
  if (movie && removeFromWatchlist(movieId)) {
    toast.success(`"${movie.title}" retiré de votre liste`);
  }
};

const handleClearWatchlist = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre liste ?')) {
    clearWatchlist();
    toast.success('Liste vidée avec succès');
  }
};

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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div v-if="recentlyViewedCount > 0" class="space-y-4">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Récemment vus</h3>
    
    <div class="flex gap-4 overflow-x-auto pb-4">
      <RouterLink
        v-for="movie in recentlyViewed.slice(0, 8)"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="flex-shrink-0 group"
      >
        <div class="w-32 space-y-2">
          <img
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-movie.jpg'"
            :alt="movie.title"
            class="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
            @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-movie.jpg'"
          />
          <div>
            <h4 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors">
              {{ movie.title }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ new Date(movie.release_date).getFullYear() }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
    
    <RouterLink
      to="/recently-viewed"
      class="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
    >
      Voir tout
      <ChevronRightIcon class="w-4 h-4 ml-1" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
import { getRecentlyViewed, getRecentlyViewedCount, loadRecentlyViewed } from '@/utils/recentlyViewed';

// Load recently viewed on component mount
loadRecentlyViewed();

const recentlyViewed = getRecentlyViewed;
const recentlyViewedCount = getRecentlyViewedCount;
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <WrapperElement>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          🔥 Films Tendance
        </h1>
        <div class="flex gap-2">
          <button
            @click="() => { timeWindow = 'day'; loadTrendingMovies(); }"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              timeWindow === 'day'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            Aujourd'hui
          </button>
          <button
            @click="() => { timeWindow = 'week'; loadTrendingMovies(); }"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              timeWindow === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            Cette semaine
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <SpinnerElement />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <button
          @click="loadTrendingMovies"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div v-if="movies.length > 0" class="flex justify-center">
          <button
            @click="loadMoreMovies"
            :disabled="loadingMore"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            <SpinnerElement v-if="loadingMore" class="w-4 h-4" />
            {{ loadingMore ? 'Chargement...' : 'Charger plus' }}
          </button>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTrendingMovies } from '@/services/apitmdb';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import MovieCard from '@/components/movies/MovieCard.vue';

const movies = ref<any[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref('');
const timeWindow = ref('week');
const currentPage = ref(1);

const loadTrendingMovies = async (reset = true) => {
  if (reset) {
    loading.value = true;
    currentPage.value = 1;
    movies.value = [];
  } else {
    loadingMore.value = true;
  }
  
  error.value = '';

  try {
    const trendingMovies = await getTrendingMovies(timeWindow.value, currentPage.value);
    
    if (reset) {
      movies.value = trendingMovies;
    } else {
      movies.value.push(...trendingMovies);
    }
  } catch (e) {
    console.error('Error loading trending movies:', e);
    error.value = 'Erreur lors du chargement des films tendance';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreMovies = async () => {
  currentPage.value++;
  await loadTrendingMovies(false);
};

onMounted(() => {
  loadTrendingMovies();
});
</script>

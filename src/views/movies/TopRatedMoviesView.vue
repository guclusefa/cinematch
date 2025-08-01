<template>
  <WrapperElement>
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ⭐ Films les Mieux Notés
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Découvrez les films avec les meilleures notes selon les utilisateurs
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <SpinnerElement />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <button
          @click="() => loadTopRatedMovies()"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="(movie, index) in movies"
            :key="movie.id"
            class="relative hover:scale-105 transition-transform duration-200"
          >
            <div class="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
              #{{ index + 1 }}
            </div>
            <MovieCard :movie="movie" />
          </div>
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
import { getTopRatedMovies } from '@/services/apitmdb';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import MovieCard from '@/components/movies/MovieCard.vue';

const movies = ref<any[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref('');
const currentPage = ref(1);

const loadTopRatedMovies = async (reset = true) => {
  if (reset) {
    loading.value = true;
    currentPage.value = 1;
    movies.value = [];
  } else {
    loadingMore.value = true;
  }
  
  error.value = '';

  try {
    const topRatedMovies = await getTopRatedMovies(currentPage.value);
    
    if (reset) {
      movies.value = topRatedMovies;
    } else {
      movies.value.push(...topRatedMovies);
    }
  } catch (e) {
    console.error('Error loading top rated movies:', e);
    error.value = 'Erreur lors du chargement des films les mieux notés';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreMovies = async () => {
  currentPage.value++;
  await loadTopRatedMovies(false);
};

onMounted(() => {
  loadTopRatedMovies();
});
</script>

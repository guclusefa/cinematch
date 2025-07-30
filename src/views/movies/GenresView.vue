<template>
  <WrapperElement>
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎭 Explorer par Genres
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Découvrez des films selon vos genres préférés
        </p>
      </div>

      <!-- Genres Grid -->
      <div v-if="loadingGenres" class="flex justify-center py-12">
        <SpinnerElement />
      </div>

      <div v-else-if="errorGenres" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ errorGenres }}</p>
        <button
          @click="() => loadGenres()"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="() => selectGenre(genre)"
          :class="[
            'p-4 rounded-lg border-2 transition-all duration-200 text-center',
            selectedGenre?.id === genre.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
          ]"
        >
          <span class="text-2xl mb-2 block">{{ getGenreEmoji(genre.name) }}</span>
          <span class="text-sm font-medium">{{ genre.name }}</span>
        </button>
      </div>

      <!-- Movies for Selected Genre -->
      <div v-if="selectedGenre">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Films {{ selectedGenre.name }}
          </h2>
          <button
            @click="clearGenreSelection"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕ Effacer
          </button>
        </div>

        <div v-if="loadingMovies" class="flex justify-center py-8">
          <SpinnerElement />
        </div>

        <div v-else-if="errorMovies" class="text-center py-8">
          <p class="text-red-500">{{ errorMovies }}</p>
          <button
            @click="() => loadMoviesByGenre()"
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
              {{ loadingMore ? 'Charger plus' : 'Charger plus' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMovieGenres, getMoviesByGenre } from '@/services/apitmdb';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import MovieCard from '@/components/movies/MovieCard.vue';

const genres = ref<any[]>([]);
const movies = ref<any[]>([]);
const selectedGenre = ref<any>(null);
const loadingGenres = ref(false);
const loadingMovies = ref(false);
const loadingMore = ref(false);
const errorGenres = ref('');
const errorMovies = ref('');
const currentPage = ref(1);

const genreEmojis: { [key: string]: string } = {
  'Action': '💥',
  'Adventure': '🗺️',
  'Animation': '🎨',
  'Comedy': '😂',
  'Crime': '🔫',
  'Documentary': '📹',
  'Drama': '🎭',
  'Family': '👨‍👩‍👧‍👦',
  'Fantasy': '🧙‍♂️',
  'History': '🏛️',
  'Horror': '👻',
  'Music': '🎵',
  'Mystery': '🕵️',
  'Romance': '💕',
  'Science Fiction': '🚀',
  'TV Movie': '📺',
  'Thriller': '😱',
  'War': '⚔️',
  'Western': '🤠'
};

const getGenreEmoji = (genreName: string) => {
  return genreEmojis[genreName] || '🎬';
};

const loadGenres = async () => {
  loadingGenres.value = true;
  errorGenres.value = '';

  try {
    const movieGenres = await getMovieGenres();
    genres.value = movieGenres;
  } catch (e) {
    console.error('Error loading genres:', e);
    errorGenres.value = 'Erreur lors du chargement des genres';
  } finally {
    loadingGenres.value = false;
  }
};

const selectGenre = async (genre: any) => {
  selectedGenre.value = genre;
  await loadMoviesByGenre();
};

const clearGenreSelection = () => {
  selectedGenre.value = null;
  movies.value = [];
  currentPage.value = 1;
};

const loadMoviesByGenre = async (reset = true) => {
  if (!selectedGenre.value) return;

  if (reset) {
    loadingMovies.value = true;
    currentPage.value = 1;
    movies.value = [];
  } else {
    loadingMore.value = true;
  }
  
  errorMovies.value = '';

  try {
    const genreMovies = await getMoviesByGenre(selectedGenre.value.id, currentPage.value);
    
    if (reset) {
      movies.value = genreMovies;
    } else {
      movies.value.push(...genreMovies);
    }
  } catch (e) {
    console.error('Error loading movies by genre:', e);
    errorMovies.value = 'Erreur lors du chargement des films';
  } finally {
    loadingMovies.value = false;
    loadingMore.value = false;
  }
};

const loadMoreMovies = async () => {
  currentPage.value++;
  await loadMoviesByGenre(false);
};

onMounted(() => {
  loadGenres();
});
</script>

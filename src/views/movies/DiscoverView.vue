<template>
  <WrapperElement>
    <div class="space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔍 Découvrir des Films
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Explorez des films avec des filtres avancés
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filtres</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Genre Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select 
              v-model="filters.genre" 
              @change="() => applyFilters()"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tous les genres</option>
              <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                {{ genre.name }}
              </option>
            </select>
          </div>

          <!-- Year Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Année
            </label>
            <select 
              v-model="filters.year" 
              @change="() => applyFilters()"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les années</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trier par
            </label>
            <select 
              v-model="filters.sortBy" 
              @change="() => applyFilters()"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="popularity.desc">Popularité ↓</option>
              <option value="popularity.asc">Popularité ↑</option>
              <option value="release_date.desc">Plus récents</option>
              <option value="release_date.asc">Plus anciens</option>
              <option value="vote_average.desc">Mieux notés</option>
              <option value="vote_count.desc">Plus de votes</option>
            </select>
          </div>

          <!-- Rating Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note minimum
            </label>
            <select 
              v-model="filters.minRating" 
              @change="() => applyFilters()"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les notes</option>
              <option value="7">7+ ⭐</option>
              <option value="8">8+ ⭐⭐</option>
              <option value="9">9+ ⭐⭐⭐</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            @click="clearFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Effacer les filtres
          </button>
          <button
            @click="() => applyFilters()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="loading" class="flex justify-center py-12">
        <SpinnerElement />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <button
          @click="() => applyFilters()"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Résultats ({{ movies.length }} films)
          </h2>
        </div>

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
import { ref, onMounted, computed } from 'vue';
import { getMovieGenres, discoverMovies } from '@/services/apitmdb';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import MovieCard from '@/components/movies/MovieCard.vue';

const genres = ref<any[]>([]);
const movies = ref<any[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref('');
const currentPage = ref(1);

const filters = ref({
  genre: '',
  year: '',
  sortBy: 'popularity.desc',
  minRating: ''
});

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  const yearList = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearList.push(year);
  }
  return yearList;
});

const loadGenres = async () => {
  try {
    const movieGenres = await getMovieGenres();
    genres.value = movieGenres;
  } catch (e) {
    console.error('Error loading genres:', e);
  }
};

const applyFilters = async (reset = true) => {
  if (reset) {
    loading.value = true;
    currentPage.value = 1;
    movies.value = [];
  } else {
    loadingMore.value = true;
  }
  
  error.value = '';

  try {
    const params: any = {
      page: currentPage.value,
      sort_by: filters.value.sortBy
    };

    if (filters.value.genre) {
      params.with_genres = filters.value.genre;
    }

    if (filters.value.year) {
      params.year = filters.value.year;
    }

    if (filters.value.minRating) {
      params['vote_average.gte'] = filters.value.minRating;
    }

    const discoveredMovies = await discoverMovies(params);
    
    if (reset) {
      movies.value = discoveredMovies;
    } else {
      movies.value.push(...discoveredMovies);
    }
  } catch (e) {
    console.error('Error discovering movies:', e);
    error.value = 'Erreur lors de la recherche de films';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreMovies = async () => {
  currentPage.value++;
  await applyFilters(false);
};

const clearFilters = () => {
  filters.value = {
    genre: '',
    year: '',
    sortBy: 'popularity.desc',
    minRating: ''
  };
  applyFilters();
};

onMounted(async () => {
  await loadGenres();
  await applyFilters();
});
</script>

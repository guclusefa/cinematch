<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
  >
    <!-- Movie Poster with Rating Badge -->
    <div class="relative">
      <router-link
        :to="{ name: 'movie', params: { id: props.movie.id } }"
        class="block overflow-hidden rounded-t-xl"
      >
        <img
          :src="moviePosterUrl"
          :alt="props.movie.title"
          class="w-full h-72 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          loading="lazy"
          @error="handleImageError"
        />
      </router-link>
      
      <!-- Rating Badge -->
      <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
        <span class="text-yellow-400">⭐</span>
        {{ convertedRating }}/5
      </div>
      
      <!-- Release Year Badge -->
      <div v-if="releaseYear" class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        {{ releaseYear }}
      </div>
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <!-- Movie Title -->
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
        {{ props.movie.title }}
      </h2>

      <!-- Movie Genres -->
      <div v-if="movieGenres.length > 0" class="flex flex-wrap gap-1 mb-2">
        <span 
          v-for="genre in movieGenres.slice(0, 3)" 
          :key="genre.id"
          class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
        >
          {{ genre.name }}
        </span>
      </div>

      <!-- Movie Info Row -->
      <div class="space-y-2 mb-3">
        <!-- Release Date -->
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>📅</span>
          <span>{{ formattedReleaseDate }}</span>
        </div>

        <!-- Runtime -->
        <div v-if="props.movie.runtime" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>⏱️</span>
          <span>{{ props.movie.runtime }} min</span>
        </div>

        <!-- Language -->
        <div v-if="props.movie.original_language" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>🌍</span>
          <span>{{ getLanguageName(props.movie.original_language) }}</span>
        </div>
      </div>

      <!-- Director Info -->
      <div v-if="director" class="mb-3">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600 dark:text-gray-400">🎬 Réalisateur:</span>
          <router-link 
            :to="{ name: 'person', params: { id: director.id } }"
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium truncate"
          >
            {{ director.name }}
          </router-link>
        </div>
      </div>

      <!-- Main Actors -->
      <div v-if="mainActors.length > 0" class="mb-3">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">🎭 Acteurs principaux:</div>
        <div class="flex flex-wrap gap-1">
          <router-link
            v-for="actor in mainActors.slice(0, 3)"
            :key="actor.id"
            :to="{ name: 'person', params: { id: actor.id } }"
            class="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {{ actor.name }}
          </router-link>
        </div>
      </div>

      <!-- Movie Overview -->
      <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 flex-grow mb-4">
        {{ props.movie.overview || 'Aucune description disponible.' }}
      </p>

      <!-- Movie Actions -->
      <div class="mt-auto">
        <MovieActions :movieId="props.movie.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from 'vue';
import { getMovieCredits } from '@/services/apitmdb';
import RatingStarsElement from '../elements/RatingStarsElement.vue';
import MovieActions from './MovieActions.vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const tmdbImageUrl = import.meta.env.VITE_TMDB_API_IMAGE_URL;
const credits = ref<any>(null);
const imageError = ref(false);

// Language mapping
const languageMap: { [key: string]: string } = {
  'en': 'Anglais',
  'fr': 'Français',
  'es': 'Espagnol', 
  'de': 'Allemand',
  'it': 'Italien',
  'ja': 'Japonais',
  'ko': 'Coréen',
  'zh': 'Chinois',
  'pt': 'Portugais',
  'ru': 'Russe'
};

// Computed properties
const moviePosterUrl = computed(() => {
  if (imageError.value || !props.movie.poster_path) {
    return 'https://via.placeholder.com/500x750/374151/9CA3AF?text=Pas+d\'image';
  }
  return `${tmdbImageUrl}/w500${props.movie.poster_path}`;
});

const convertedRating = computed(() => {
  if (!props.movie.vote_average) return '0.0';
  return (props.movie.vote_average / 2).toFixed(1);
});

const releaseYear = computed(() => {
  if (!props.movie.release_date) return null;
  return new Date(props.movie.release_date).getFullYear();
});

const formattedReleaseDate = computed(() => {
  if (!props.movie.release_date) return 'Date inconnue';
  return new Date(props.movie.release_date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const movieGenres = computed(() => {
  return props.movie.genres || [];
});

const director = computed(() => {
  if (!credits.value?.crew) return null;
  return credits.value.crew.find((person: any) => person.job === 'Director');
});

const mainActors = computed(() => {
  if (!credits.value?.cast) return [];
  return credits.value.cast.slice(0, 5);
});

const getLanguageName = (langCode: string) => {
  return languageMap[langCode] || langCode.toUpperCase();
};

const handleImageError = () => {
  imageError.value = true;
};

// Load additional movie data
const loadMovieCredits = async () => {
  try {
    const movieCredits = await getMovieCredits(props.movie.id);
    credits.value = movieCredits;
  } catch (error) {
    console.log('Error loading movie credits:', error);
  }
};

onMounted(() => {
  loadMovieCredits();
});
</script>

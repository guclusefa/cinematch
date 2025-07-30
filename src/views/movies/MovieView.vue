<template>
  <WrapperElement>
    <div v-if="movie" class="space-y-8">
      <!-- Hero Section with Movie Info -->
      <div class="relative overflow-hidden rounded-2xl shadow-2xl">
        <!-- Background Backdrop -->
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` : 'none' }"
        >
          <div class="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
        
        <!-- Movie Content -->
        <div class="relative z-10 flex flex-col lg:flex-row gap-8 p-8 lg:p-12">
          <!-- Movie Poster -->
          <div class="flex-shrink-0">
            <img
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'"
              :alt="movie.title"
              class="w-64 h-96 object-cover rounded-xl shadow-2xl mx-auto lg:mx-0"
              @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-movie.jpg'"
            />
          </div>

          <!-- Movie Details -->
          <div class="flex-1 text-white space-y-6">
            <div>
              <h1 class="text-4xl lg:text-6xl font-bold mb-2">{{ movie.title }}</h1>
              <p v-if="movie.tagline" class="text-xl italic text-gray-300">{{ movie.tagline }}</p>
            </div>

            <!-- Meta Information -->
            <div class="flex flex-wrap gap-6 text-lg">
              <div class="flex items-center gap-2">
                <span class="font-semibold">⭐</span>
                <RatingStarsElement :rating="movie.vote_average / 2" />
                <span>{{ (movie.vote_average / 2).toFixed(1) }}/5</span>
                <span class="text-gray-300">({{ movie.vote_count }} votes)</span>
              </div>
              <div>📅 {{ new Date(movie.release_date).getFullYear() }}</div>
              <div>⏱️ {{ formatRuntime(movie.runtime) }}</div>
              <div>🗣️ {{ movie.original_language?.toUpperCase() }}</div>
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in movie.genres"
                :key="genre.id"
                class="bg-red-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ genre.name }}
              </span>
            </div>

            <!-- Synopsis -->
            <div>
              <h3 class="text-2xl font-bold mb-3">Synopsis</h3>
              <p class="text-lg leading-relaxed">{{ movie.overview }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <WatchlistButton :movie="movie" />
            </div>
          </div>

          <!-- Rating Section -->
          <div class="flex-shrink-0 w-full lg:w-80">
            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <h2 class="text-2xl font-bold mb-6 text-center text-white">⭐ Noter ce film</h2>
              <form @submit.prevent="submitRating" class="space-y-4">
                <div class="flex justify-center space-x-1">
                  <template v-for="star in 5" :key="star">
                    <svg 
                      @click="setRating(star)" 
                      @mouseover="hoverRating = star" 
                      @mouseleave="hoverRating = 0"
                      xmlns="http://www.w3.org/2000/svg" 
                      :class="[
                        'w-10 h-10 cursor-pointer transition-colors duration-200',
                        star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-400'
                      ]" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.045 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  </template>
                </div>
                
                <div v-if="existingRating" class="text-center text-yellow-300 text-sm">
                  Votre note actuelle: {{ existingRating }}/5 ⭐
                </div>
                
                <button 
                  type="submit"
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="submitting || rating === 0"
                >
                  {{ submitting ? 'Envoi...' : existingRating ? 'Modifier ma note' : 'Noter ce film' }}
                </button>
              </form>
              
              <p v-if="rating > 0" class="mt-3 text-center text-white text-sm">
                Nouvelle note : <strong>{{ rating }}/5 étoiles</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast & Crew Section -->
      <div v-if="credits" class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <!-- Directors -->
        <div v-if="directors.length" class="mb-8">
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎬 Réalisation</h3>
          <div class="flex flex-wrap gap-4">
            <div 
              v-for="director in directors" 
              :key="director.id"
              class="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
            >
              <img 
                :src="director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : '/placeholder-person.jpg'"
                :alt="director.name"
                class="w-12 h-12 rounded-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-person.jpg'"
              />
              <span class="font-semibold text-gray-900 dark:text-white">{{ director.name }}</span>
            </div>
          </div>
        </div>

        <!-- Main Cast -->
        <div v-if="mainCast.length" class="mb-8">
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎭 Distribution principale</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div 
              v-for="actor in mainCast" 
              :key="actor.id"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <img 
                :src="actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-person.jpg'"
                :alt="actor.name"
                class="w-20 h-20 mx-auto rounded-full object-cover mb-3"
                @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-person.jpg'"
              />
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">{{ actor.name }}</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ actor.character }}</p>
            </div>
          </div>
        </div>

        <!-- Production Info -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Production Companies -->
          <div v-if="movie.production_companies?.length" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 dark:text-white">🏢 Production</h4>
            <ul class="space-y-2">
              <li 
                v-for="company in movie.production_companies.slice(0, 3)" 
                :key="company.id"
                class="text-gray-700 dark:text-gray-300"
              >
                {{ company.name }}
              </li>
            </ul>
          </div>

          <!-- Financial Info -->
          <div v-if="movie.budget || movie.revenue" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 dark:text-white">💰 Box Office</h4>
            <div class="space-y-2">
              <div v-if="movie.budget" class="text-gray-700 dark:text-gray-300">
                <strong>Budget:</strong> {{ formatCurrency(movie.budget) }}
              </div>
              <div v-if="movie.revenue" class="text-gray-700 dark:text-gray-300">
                <strong>Recettes:</strong> {{ formatCurrency(movie.revenue) }}
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 dark:text-white">ℹ️ Informations</h4>
            <div class="space-y-2 text-gray-700 dark:text-gray-300">
              <div><strong>Titre original:</strong> {{ movie.original_title }}</div>
              <div><strong>Statut:</strong> {{ movie.status }}</div>
              <div v-if="movie.spoken_languages?.length">
                <strong>Langues:</strong> {{ movie.spoken_languages.map((l: any) => l.english_name).join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SpinnerElement v-else />
  </WrapperElement>
</template>

<script setup lang="ts">
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import RatingStarsElement from '@/components/elements/RatingStarsElement.vue';
import WatchlistButton from '@/components/elements/WatchlistButton.vue';

import { getMovieDetails, getMovieCredits } from '@/services/apitmdb';
import api from '@/services/api';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import { getUser } from '@/utils/auth';
import { addToRecentlyViewed } from '@/utils/recentlyViewed';

const route = useRoute();
const movie = ref<any>(null);
const credits = ref<any>(null);
const rating = ref(0);
const hoverRating = ref(0);
const submitting = ref(false);
const user = getUser();

// Local storage key for user ratings
const getRatingKey = (movieId: string | number) => `movie_rating_${user?.id}_${movieId}`;

// Get existing rating from localStorage
const existingRating = computed(() => {
  if (!user || !movie.value) return null;
  const stored = localStorage.getItem(getRatingKey(movie.value.id));
  return stored ? parseInt(stored) : null;
});

// Helper functions
const formatRuntime = (minutes: number) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Computed properties for cast and crew
const directors = computed(() => {
  if (!credits.value?.crew) return [];
  return credits.value.crew.filter((person: any) => person.job === 'Director');
});

const mainCast = computed(() => {
  if (!credits.value?.cast) return [];
  return credits.value.cast.slice(0, 12); // Top 12 cast members
});

// Set rating with localStorage update
const setRating = (newRating: number) => {
  rating.value = newRating;
};

onMounted(async () => {
  const movieId = route.params.id as string;
  try {
    // Load movie details and credits in parallel
    const [movieData, creditsData] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId)
    ]);
    
    movie.value = movieData;
    credits.value = creditsData;
    
    // Add to recently viewed
    addToRecentlyViewed(movieData);
    
    // Load existing rating from localStorage
    const existingRatingValue = existingRating.value;
    if (existingRatingValue) {
      rating.value = existingRatingValue;
    }
  } catch (error) {
    toast.error("Le film demandé n'a pas pu être trouvé.");
  }
});

const submitRating = async () => {
  if (!user) {
    toast.error("Vous devez être connecté pour noter un film.");
    return;
  }
  if (rating.value === 0) {
    toast.error("Veuillez sélectionner une note avant de soumettre.");
    return;
  }
  
  try {
    submitting.value = true;
    console.log(`Envoi de la note ${rating.value} pour le film ${route.params.id} par l'utilisateur ${user.id}`);
    
    // Send rating to your API (unchanged)
    await api.rateMovie(user.id, route.params.id as string, rating.value);
    
    // Store rating in localStorage for persistence
    localStorage.setItem(getRatingKey(movie.value.id), rating.value.toString());
    
    toast.success("Votre note a bien été enregistrée !");
  } catch (error) {
    toast.error("Une erreur est survenue lors de l'envoi de votre note.");
  } finally {
    submitting.value = false;
  }
};
</script>

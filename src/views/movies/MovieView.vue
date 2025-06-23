<template>
  <WrapperElement>
    <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
      <!-- Carte du film -->
      <div class="flex-1 min-w-0">
        <MovieItem :movie="movie" v-if="movie" />
        <SpinnerElement v-else />
      </div>

      <!-- Zone de notation -->
      <div class="w-full lg:w-1/3 flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">⭐ Noter ce film</h2>
        <form @submit.prevent="submitRating" class="flex flex-col items-center space-y-4 w-full max-w-xs">
          <div class="flex space-x-2 select-none justify-center">
            <template v-for="star in 5" :key="star">
              <svg @click="rating = star" @mouseover="hoverRating = star" @mouseleave="hoverRating = 0"
                xmlns="http://www.w3.org/2000/svg" :class="[
                  'w-10 h-10 cursor-pointer transition-colors duration-200',
                  star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                ]" fill="currentColor" viewBox="0 0 20 20" role="button" aria-label="Note star">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.045 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </template>
          </div>
          <button type="submit"
            class="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="submitting || rating === 0">
            {{ submitting ? 'Envoi...' : 'Soumettre' }}
          </button>

        </form>
        <p v-if="rating > 0" class="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
          Vous avez sélectionné : <strong>{{ rating }}</strong> / 5 étoiles
        </p>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MovieItem from '@/components/movies/MovieItem.vue';

import { getMovieDetails } from '@/services/apitmdb';
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import { getUser } from '@/utils/auth';

const route = useRoute();
const movie = ref(null);
const rating = ref(0);
const hoverRating = ref(0);
const submitting = ref(false);
const user = getUser();

onMounted(async () => {
  const movieId = route.params.id;
  try {
    movie.value = await getMovieDetails(movieId);
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
    await api.rateMovie(user.id, route.params.id, rating.value);
    toast.success("Votre note a bien été enregistrée !");
  } catch (error) {
    toast.error("Une erreur est survenue lors de l'envoi de votre note.");
  } finally {
    submitting.value = false;
  }
};
</script>

<script setup lang="ts">
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MovieItem from '@/components/movies/MovieItem.vue';

import { getMovieDetails } from '@/services/apitmdb';
import api from '@/services/api'; // <- using api.js
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import { getUser } from '@/utils/auth';

const route = useRoute();
const movie = ref(null);
const rating = ref(0);
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


<template>
  <WrapperElement>
    <MovieItem :movie="movie" v-if="movie" />
    <SpinnerElement v-else />

    <div v-if="movie" class="mt-8">
      <h2 class="text-lg font-semibold mb-2">Noter ce film</h2>
      <form @submit.prevent="submitRating" class="flex items-center space-x-4">
        <select v-model="rating" class="p-2 border rounded">
          <option disabled value="0">Sélectionnez une note</option>
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="submitting"
        >
          {{ submitting ? 'Envoi...' : 'Soumettre' }}
        </button>
      </form>
    </div>
  </WrapperElement>
</template>


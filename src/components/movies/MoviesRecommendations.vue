<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MovieCard from './MovieCard.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import ButtonElement from '../elements/ButtonElement.vue';

import api from '@/services/api';
import { getMovieDetails } from '@/services/apitmdb';
import { getUser } from '@/utils/auth';

const user = getUser();
const movies = ref([]);
const isLoading = ref(false);

// Fetch recommendations and load full movie details
const loadRecommendations = async () => {
  if (!user) return;

  isLoading.value = true;
  try {
    const recommendations = await api.getRecommendations(user.id);
    const detailedMovies = await Promise.all(
      recommendations.map(tmdbId => getMovieDetails(tmdbId))
    );
    movies.value = detailedMovies;
  } catch (error) {
    console.error("Erreur lors du chargement des recommandations :", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadRecommendations();
});
</script>


<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Recommandations personnalisées</h2>

    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      <li v-for="movie in movies" :key="movie.id">
        <MovieCard :movie="movie" />
      </li>
    </ul>

    <div v-if="isLoading" class="flex justify-center mt-6">
      <SpinnerElement />
    </div>
  </div>
</template>

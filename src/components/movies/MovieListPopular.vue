<script setup lang="ts">
import { getPopularMovies } from '@/services/apitmdb';
import { onMounted, ref } from 'vue';
import ButtonElement from '../elements/ButtonElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import MovieCard from './MovieCard.vue';

const movies = ref([]);
const currentPage = ref(1);
const isLoading = ref(false);

// Function to load movies
const loadMovies = async () => {
  isLoading.value = true;
  try {
    const results = await getPopularMovies(currentPage.value);
    movies.value = [...movies.value, ...results]; // Append new movies to the existing list
    currentPage.value += 1; // Increment page
  } catch (error) {
    console.error('Error loading movies:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load initial movies when the component is mounted
onMounted(async () => {
  await loadMovies();
});
</script>

<template>
  <div>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      <li v-for="movie in movies" :key="movie.id">
        <MovieCard :movie="movie" />
      </li>
    </ul>

    <!-- "See More" Button -->
    <div class="flex justify-center mt-6">
      <ButtonElement primary type="submit" :disabled="isLoading" @click="loadMovies">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="isLoading" />
          <div>Voir plus</div>
        </div>
      </ButtonElement>
    </div>
  </div>
</template>

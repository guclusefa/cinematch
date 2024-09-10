<script setup lang="ts">
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MovieItem from '@/components/movies/MovieItem.vue';

import { getMovieDetails } from '@/services/apitmdb';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute();
const movie = ref(null);

// Fetch movie details based on the ID from the route
onMounted(async () => {
  const movieId = route.params.id;
  try {
    movie.value = await getMovieDetails(movieId);
  } catch (error) {
    toast.error("Le film demandé n'a pas pu être trouvé.");
  }
});
</script>

<template>
  <WrapperElement>
    <MovieItem :movie="movie" v-if="movie" />
    <SpinnerElement v-else />
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { searchMovies } from '@/services/apitmdb';
import ButtonElement from '../elements/ButtonElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import MovieCard from './MovieCard.vue';

const movies = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const isLoading = ref(false);

const route = useRoute(); // Access route information

// Function to load search results
const loadSearchResults = async () => {
  if (!searchQuery.value) return; // Do nothing if the search query is empty
  isLoading.value = true;
  try {
    const results = await searchMovies(searchQuery.value, currentPage.value);
    if (currentPage.value === 1) {
      movies.value = results; // Replace the list for new searches
    } else {
      movies.value = [...movies.value, ...results]; // Append results for pagination
    }
    currentPage.value += 1; // Increment page
  } catch (error) {
    console.error('Error searching movies:', error);
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes to the "q" parameter and reload the search
watch(
  () => route.query.q,
  async (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery as string;
      currentPage.value = 1; // Reset pagination
      movies.value = []; // Clear previous results
      await loadSearchResults();
    }
  },
  { immediate: true } // Run immediately on component mount
);
</script>

<template>
  <div>
    <p class="text-center text-lg md:text-xl mb-4">
      Résultats de recherche pour "<strong>{{ searchQuery }}</strong>"
    </p>
    <p class="text-center text-sm md:text-base mb-6">
      {{ movies.length }} résultats trouvés
    </p>
    <!-- Movie List -->
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <li v-for="movie in movies" :key="movie.id">
        <MovieCard :movie="movie" />
      </li>
    </ul>

    <!-- "See More" Button -->
    <div class="flex justify-center mt-6" v-if="movies.length > 0">
      <ButtonElement primary type="submit" :disabled="isLoading" @click="loadSearchResults">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="isLoading" />
          <div>Voir plus</div>
        </div>
      </ButtonElement>
    </div>
  </div>
</template>
  
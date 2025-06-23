<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MovieListSearch from '@/components/movies/MovieListSearch.vue';
</script>

<template>
  <!-- Search Section -->
  <WrapperElement>
    <div class="py-12">
      <!-- Custom Section Title -->
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-secondary-darkest dark:text-white flex items-center justify-center gap-2">
          🔎 Recherche de Films <span class="animate-bounce">🎥</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
          Tapez le nom d’un film, un genre ou un acteur pour commencer votre exploration.
        </p>
      </div>

      <!-- Movie Search Component -->
      <MovieListSearch />
    </div>
  </WrapperElement>
</template>

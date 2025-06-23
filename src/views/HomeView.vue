<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MoviesListPopular from '@/components/movies/MovieListPopular.vue';
</script>

<template>
  <!-- Hero Section -->
  <div class="bg-gradient-to-br from-primary-lightest via-primary-dark to-gray-900 text-white py-24 px-4">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-5xl font-bold mb-4 drop-shadow">🎬 Cinematch</h1>
      <p class="text-xl md:text-2xl mb-6">
        Découvrez les films les plus populaires et trouvez ceux qui correspondent à vos goûts.
      </p>
      <p class="text-base text-gray-200">
        Connectez-vous pour des recommandations personnalisées basées sur ce que vous aimez.
      </p>
    </div>
  </div>

  <!-- Movie Section -->
  <WrapperElement>
    <div class="py-12">
      <!-- Custom Section Header -->
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-secondary-darkest dark:text-white flex items-center justify-center gap-3">
          🍿 <span>Films Populaires à Ne Pas Manquer</span> 🔥
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">
          Voici les films que tout le monde regarde en ce moment.
        </p>
      </div>

      <!-- Movie List -->
      <MoviesListPopular />
    </div>
  </WrapperElement>
</template>

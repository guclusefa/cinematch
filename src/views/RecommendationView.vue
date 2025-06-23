<script setup lang="ts">
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MoviesRecommendations from '@/components/movies/MoviesRecommendations.vue';
import { getUser } from '@/utils/auth';
import { ref } from 'vue';

const user = ref(getUser());
</script>

<template>
  <WrapperElement>
    <!-- Custom Section Header -->
    <div class="mb-10 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold text-primary-dark drop-shadow flex items-center justify-center gap-2">
        🎯 Vos Recommandations <span class="animate-pulse text-primary">✨</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
        Films choisis spécialement pour vous selon vos goûts.
      </p>
    </div>

    <div v-if="user">
      <MoviesRecommendations />
    </div>
    <div
      v-else
      class="bg-yellow-50 dark:bg-yellow-100 text-yellow-900 border border-yellow-200 dark:border-yellow-300 p-5 rounded-xl text-center shadow-sm"
    >
      <p class="font-semibold text-lg">⚠️ Veuillez vous connecter pour voir vos recommandations personnalisées.</p>
    </div>
  </WrapperElement>
</template>

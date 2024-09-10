<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MoviesListPopular from '@/components/movies/MovieListPopular.vue';
</script>

<template>
  <div class="bg-gradient-to-r from-primary-lightest to-primary-darkest text-white py-20">
    <div class="container mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">Cinematch</h1>
      <p class="text-lg md:text-2xl mb-8">
        Découvrez les films les plus populaires et trouvez des films à regarder basés sur vos goûts.
      </p>
    </div>
  </div>

  <WrapperElement>
    <SectionElement title="Films populaires">
      <template #content>
        <MoviesListPopular />
      </template>
    </SectionElement>
  </WrapperElement>
</template>

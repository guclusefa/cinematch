<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MoviesListPopular from '@/components/movies/MovieListPopular.vue';
</script>

<template>
  <WrapperElement>
    <SectionElement title="Vos recommandations">
      <template #content>
        <MoviesListPopular />
      </template>
    </SectionElement>
  </WrapperElement>
</template>

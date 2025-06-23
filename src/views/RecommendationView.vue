<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MoviesRecommendations from '@/components/movies/MoviesRecommendations.vue';
</script>

<template>
  <WrapperElement>
    <SectionElement title="Vos recommandations">
      <template #content>
        <MoviesRecommendations />
      </template>
    </SectionElement>
  </WrapperElement>
</template>

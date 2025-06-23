<template>
  <div
    class="max-w-5xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900"
  >
    <div v-if="movie" class="flex flex-col lg:flex-row gap-8 p-8">
      <!-- Affiche du film -->
      <img
        :src="'https://image.tmdb.org/t/p/w500' + props.movie.poster_path"
        :alt="props.movie.title"
        class="rounded-xl flex-shrink-0 w-full max-w-xs mx-auto lg:mx-0 lg:w-auto object-cover shadow-lg"
      />

      <!-- Détails du film -->
      <div class="flex-grow flex flex-col">
        <h1
          class="text-4xl font-extrabold mb-5 text-gray-900 dark:text-gray-100 tracking-tight"
        >
          {{ props.movie.title }}
        </h1>

        <div class="flex flex-wrap gap-8 text-gray-700 dark:text-gray-300 text-base mb-8">
          <p><strong>Date de sortie :</strong> {{ new Date(props.movie.release_date).toLocaleDateString('fr-FR') }}</p>
          <p class="flex items-center gap-3">
            <strong>Note :</strong>
            <RatingStarsElement :rating="props.movie.vote_average" />
            <span class="font-semibold">{{ props.movie.vote_average }} / 10</span>
          </p>
          <p><strong>Durée :</strong> {{ props.movie.runtime }} min</p>
        </div>

        <!-- Genres -->
        <div class="mb-8">
          <strong class="text-lg text-gray-800 dark:text-gray-200">Genres :</strong>
          <div class="mt-3 flex flex-wrap gap-3">
            <span
              v-for="genre in props.movie.genres"
              :key="genre.id"
              class="bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide shadow-sm"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>

        <!-- Synopsis -->
        <section class="mb-10">
          <h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Synopsis</h2>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">{{ props.movie.overview }}</p>
        </section>

        <!-- Informations complémentaires -->
        <section class="space-y-8 text-gray-700 dark:text-gray-300">
          <div v-if="props.movie.tagline" class="border-l-4 border-red-500 pl-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Phrase d'accroche</h3>
            <p class="italic text-gray-600 dark:text-gray-400">« {{ props.movie.tagline }} »</p>
          </div>

          <div v-if="props.movie.production_companies.length" class="border-l-4 border-red-500 pl-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Sociétés de production</h3>
            <ul class="list-disc pl-6 space-y-1">
              <li v-for="company in props.movie.production_companies" :key="company.id">
                {{ company.name }}
              </li>
            </ul>
          </div>

          <div v-if="props.movie.budget" class="border-l-4 border-red-500 pl-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Budget</h3>
            <p>{{ props.movie.budget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</p>
          </div>

          <div v-if="props.movie.revenue" class="border-l-4 border-red-500 pl-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Revenus</h3>
            <p>{{ props.movie.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</p>
          </div>
        </section>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-else class="text-center py-16 text-gray-500 dark:text-gray-400 text-lg font-medium">
      Chargement en cours...
    </div>
  </div>
</template>

<script setup lang="ts">
import RatingStarsElement from '@/components/elements/RatingStarsElement.vue';

const props = defineProps<{
  movie: {
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
    runtime: number;
    genres: { id: number; name: string }[];
    tagline?: string;
    production_companies: { id: number; name: string }[];
    budget?: number;
    revenue?: number;
  };
}>();
</script>

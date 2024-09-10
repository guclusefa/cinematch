<template>
  <div class="shadow-xl hover:shadow-2xl transition duration-300 ease-in-out hover:cursor-pointer border border-gray-200 rounded-lg overflow-hidden">
    <div
      v-if="movie"
      class="flex flex-col lg:flex-row gap-6 bg-white rounded-lg shadow-md overflow-hidden"
    >
      <!-- Movie Poster -->
      <img
        :src="'https://image.tmdb.org/t/p/original' + props.movie.poster_path"
        :alt="props.movie.title"
        class="w-full lg:w-1/3 h-auto object-cover rounded-t-lg lg:rounded-l-lg"
      />

      <!-- Movie Details -->
      <div class="flex-grow p-6">
        <h1 class="text-4xl font-bold mb-4 text-gray-900">{{ props.movie.title }}</h1>

        <!-- Release Date, Rating, and Other Information -->
        <div class="text-gray-700 text-lg space-y-2 mb-6">
          <p><strong class="font-semibold">Release Date:</strong> {{ props.movie.release_date }}</p>
          <p><strong class="font-semibold">Rating:</strong> {{ props.movie.vote_average }} / 10</p>
          <p><strong class="font-semibold">Runtime:</strong> {{ props.movie.runtime }} minutes</p>
          <p>
            <strong class="font-semibold">Genres: </strong>
            <span
              v-for="(genre, index) in props.movie.genres"
              :key="index"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-1"
            >
              {{ genre.name }}
            </span>
          </p>
        </div>

        <!-- Movie Overview -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2 text-gray-800">Overview</h2>
          <p class="text-gray-600">{{ props.movie.overview }}</p>
        </div>

        <!-- Additional Information (Optional Fields) -->
        <div class="space-y-4">
          <div v-if="props.movie.tagline">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Tagline</h2>
            <p class="italic text-gray-600">{{ props.movie.tagline }}</p>
          </div>

          <div v-if="props.movie.production_companies.length">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Production Companies</h2>
            <ul class="list-disc pl-5 text-gray-600">
              <li v-for="company in props.movie.production_companies" :key="company.id">
                {{ company.name }}
              </li>
            </ul>
          </div>

          <div v-if="props.movie.budget">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Budget</h2>
            <p class="text-gray-600">${{ new Intl.NumberFormat().format(props.movie.budget) }}</p>
          </div>

          <div v-if="props.movie.revenue">
            <h2 class="text-2xl font-semibold mb-2 text-gray-800">Revenue</h2>
            <p class="text-gray-600">${{ new Intl.NumberFormat().format(props.movie.revenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-6">
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

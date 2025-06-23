<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
  >
    <router-link
      :to="{ name: 'movie', params: { id: props.movie.id } }"
      class="block overflow-hidden rounded-t-xl"
    >
      <img
        :src="'https://image.tmdb.org/t/p/w500' + props.movie.poster_path"
        :alt="props.movie.title"
        class="w-full h-72 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        loading="lazy"
      />
    </router-link>

    <div class="p-5 flex flex-col flex-grow">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
        {{ props.movie.title }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-1 flex items-center gap-1.5">
        <span title="Date de sortie" aria-label="Date de sortie">📅</span>
        <span>{{ new Date(props.movie.release_date).toLocaleDateString('fr-FR') }}</span>
      </p>

      <p class="flex items-center gap-3 text-sm mb-3  font-semibold">
        <RatingStarsElement :rating="props.movie.vote_average" />
        <span>{{ props.movie.vote_average.toFixed(1) }} / 10</span>
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 flex-grow mb-4">
        {{ props.movie.overview }}
      </p>

      <div>
        <MovieActions :movieId="props.movie.id" />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { EyeIcon, HeartIcon } from '@heroicons/vue/24/outline';
import { EyeIcon as EyeIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import { defineProps, ref } from 'vue';
import IconElement from '../elements/IconElement.vue';
import RatingStarsElement from '../elements/RatingStarsElement.vue';
import MovieActions from './MovieActions.vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const watched = ref(false);
const liked = ref(false);

const toggleWatched = () => {
  watched.value = !watched.value;
};

const toggleLiked = () => {
  liked.value = !liked.value;
};
</script>

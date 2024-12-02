<template>

  <div
    class="bg-white dark:bg-gray-800 rounded overflow-hidden shadow dark:shadow-[0_0_10px_#000000] hover:shadow-xl dark:hover:shadow-[0_0_15px_#1f1f1f] transition duration-300 h-full flex flex-col">
    <router-link :to="{ name: 'movie', params: { id: props.movie.id } }" class="block">
      <img :src="'https://image.tmdb.org/t/p/w500' + props.movie.poster_path" :alt="props.movie.title"
        class="w-full h-96 object-cover transition duration-300 transform hover:scale-110" />
    </router-link>
    <div class="p-4 flex flex-col flex-grow">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ props.movie.title }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        <strong>Date de sortie:</strong> {{ props.movie.release_date }}
      </p>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
        <strong>Note:</strong> {{ props.movie.vote_average }} / 10
        <RatingStarsElement :rating="props.movie.vote_average" />
      </p>
      <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 flex-grow">{{ props.movie.overview }}</p>

      <!-- Watched and Liked buttons -->
      <div class="flex items-center justify-start gap-2 mt-4">
        <IconElement @click.stop="toggleWatched" :class="[
          watched ? 'text-green-500 dark:text-green-400' : 'text-gray-600 dark:text-gray-400',
        ]" :title="watched ? 'Je n\'ai pas vu' : 'Je l\'ai vu'">
          <template v-if="watched">
            <EyeIconSolid class="w-5 h-5" />
          </template>
          <template v-else>
            <EyeIcon class="w-5 h-5" />
          </template>
        </IconElement>

        <IconElement @click.stop="toggleLiked" :class="[
          liked ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
        ]" :title="liked ? 'Je n\'aime plus' : 'J\'aime'">
          <template v-if="liked">
            <HeartIconSolid class="w-5 h-5" />
          </template>
          <template v-else>
            <HeartIcon class="w-5 h-5" />
          </template>
        </IconElement>
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

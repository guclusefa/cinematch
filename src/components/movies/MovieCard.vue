<template>
  <router-link :to="{ name: 'movie', params: { id: props.movie.id } }" class="block">
    <div class="bg-white rounded overflow-hidden shadow hover:shadow-xl transition duration-300 h-full flex flex-col">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + props.movie.poster_path"
        :alt="props.movie.title"
        class="w-full h-96 object-cover transition duration-300 transform hover:scale-110"
      />
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold">{{ props.movie.title }}</h2>
        <p class="text-gray-600 text-sm">
          <strong>Release Date:</strong> {{ props.movie.release_date }}
        </p>
        <p class="text-gray-600 text-sm mb-2">
          <strong>Rating:</strong> {{ props.movie.vote_average }} / 10
        </p>
        <p class="text-gray-700 text-sm line-clamp-3 flex-grow">{{ props.movie.overview }}</p>

        <!-- Watched and Liked buttons -->
        <div class="flex items-center justify-start gap-2 mt-4">
          <IconElement
            @click.stop="toggleWatched"
            :class="{ 'text-green-500': watched }"
            :title="watched ? 'Je n\'ai pas vu' : 'Je l\'ai vu'"
          >
            <template v-if="watched">
              <EyeIconSolid class="w-5 h-5" />
            </template>
            <template v-else>
              <EyeIcon class="w-5 h-5" />
            </template>
          </IconElement>

          <IconElement
            @click.stop="toggleLiked"
            :class="{ 'text-red-500': liked }"
            :title="liked ? 'Je n\'aime plus' : 'J\'aime'"
          >
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
  </router-link>
</template>

<script setup lang="ts">
import { EyeIcon, HeartIcon } from '@heroicons/vue/24/outline';
import { EyeIcon as EyeIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import { defineProps, ref } from 'vue';
import IconElement from '../elements/IconElement.vue';

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

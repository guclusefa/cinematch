<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { getMovieDetails } from '@/services/apitmdb';
import MovieCard from '../movies/MovieCard.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const props = defineProps<{
  userId: string;
}>();

interface Rating {
  user_id: string;
  tmdb_id: number;
  rating: number;
  created_at: string;
}

interface MovieWithRating {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  rating: number;
}

const isLoading = ref(true);
const likedMovies = ref<MovieWithRating[]>([]);
const dislikedMovies = ref<MovieWithRating[]>([]);
const lovedMovies = ref<MovieWithRating[]>([]);

const fetchUserRatings = async () => {
  try {
    const response = await api.get(`/rating/users/${props.userId}/ratings`);
    const ratings: Rating[] = response.data;

    const moviePromises = ratings.map(async (rating) => {
      const movieDetails = await getMovieDetails(rating.tmdb_id);
      return {
        ...movieDetails,
        rating: rating.rating
      };
    });

    const movies = await Promise.all(moviePromises);

    likedMovies.value = movies.filter(movie => movie.rating === 1);
    dislikedMovies.value = movies.filter(movie => movie.rating === -1);
    lovedMovies.value = movies.filter(movie => movie.rating === 2);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUserRatings);
</script>

<template>
  <div class="w-full">
    <TabGroup>
      <TabList class="flex space-x-4 border-b border-gray-200 mb-6">
        <Tab v-slot="{ selected }" as="template">
          <button
            :class="[
              'py-2 px-4 text-sm font-medium leading-5 focus:outline-none',
              selected
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Films aimés ({{ likedMovies.length }})
          </button>
        </Tab>
        <Tab v-slot="{ selected }" as="template">
          <button
            :class="[
              'py-2 px-4 text-sm font-medium leading-5 focus:outline-none',
              selected
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Films détestés ({{ dislikedMovies.length }})
          </button>
        </Tab>
        <Tab v-slot="{ selected }" as="template">
          <button
            :class="[
              'py-2 px-4 text-sm font-medium leading-5 focus:outline-none',
              selected
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Films adorés ({{ lovedMovies.length }})
          </button>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <div v-if="isLoading" class="flex justify-center">
            <SpinnerElement />
          </div>
          <div v-else-if="likedMovies.length === 0" class="text-center text-gray-500">
            Aucun film aimé pour le moment
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <MovieCard v-for="movie in likedMovies" :key="movie.id" :movie="movie" />
          </div>
        </TabPanel>

        <TabPanel>
          <div v-if="isLoading" class="flex justify-center">
            <SpinnerElement />
          </div>
          <div v-else-if="dislikedMovies.length === 0" class="text-center text-gray-500">
            Aucun film détesté pour le moment
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <MovieCard v-for="movie in dislikedMovies" :key="movie.id" :movie="movie" />
          </div>
        </TabPanel>

        <TabPanel>
          <div v-if="isLoading" class="flex justify-center">
            <SpinnerElement />
          </div>
          <div v-else-if="lovedMovies.length === 0" class="text-center text-gray-500">
            Aucun film adoré pour le moment
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <MovieCard v-for="movie in lovedMovies" :key="movie.id" :movie="movie" />
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template> 
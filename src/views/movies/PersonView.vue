<template>
  <WrapperElement>
    <div v-if="loading" class="flex justify-center py-12">
      <SpinnerElement />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <button
        @click="() => loadPersonDetails()"
        class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Réessayer
      </button>
    </div>

    <div v-else-if="person" class="space-y-8">
      <!-- Person Header -->
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0">
          <img
            v-if="person.profile_path"
            :src="`${tmdbImageUrl}/w500${person.profile_path}`"
            :alt="person.name"
            class="w-64 h-96 object-cover rounded-lg shadow-lg"
          />
          <div
            v-else
            class="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span class="text-gray-500 text-6xl">👤</span>
          </div>
        </div>

        <div class="flex-1 space-y-4">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
            {{ person.name }}
          </h1>

          <div class="space-y-2">
            <div v-if="person.birthday" class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Né(e) le:</span>
              <span>{{ formatDate(person.birthday) }}</span>
              <span v-if="person.place_of_birth" class="text-gray-500">
                à {{ person.place_of_birth }}
              </span>
            </div>

            <div v-if="person.deathday" class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Décédé(e) le:</span>
              <span>{{ formatDate(person.deathday) }}</span>
            </div>

            <div v-if="person.known_for_department" class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Connu pour:</span>
              <span>{{ person.known_for_department }}</span>
            </div>

            <div v-if="person.popularity" class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Popularité:</span>
              <span class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                {{ Math.round(person.popularity) }}
              </span>
            </div>
          </div>

          <div v-if="person.biography" class="space-y-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Biographie</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ person.biography }}
            </p>
          </div>
        </div>
      </div>

      <!-- Person's Movies -->
      <div v-if="personMovies.length > 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Filmographie ({{ personMovies.length }} films)
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="movie in personMovies.slice(0, 20)"
            :key="movie.id"
            class="hover:scale-105 transition-transform duration-200"
          >
            <MovieCard :movie="movie" />
          </div>
        </div>

        <div v-if="personMovies.length > 20" class="text-center">
          <button
            @click="showAllMovies = !showAllMovies"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {{ showAllMovies ? 'Voir moins' : `Voir tous les ${personMovies.length} films` }}
          </button>
        </div>

        <div v-if="showAllMovies" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="movie in personMovies.slice(20)"
            :key="movie.id"
            class="hover:scale-105 transition-transform duration-200"
          >
            <MovieCard :movie="movie" />
          </div>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPersonDetails, getPersonMovieCredits } from '@/services/apitmdb';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import MovieCard from '@/components/movies/MovieCard.vue';

const route = useRoute();
const person = ref<any>(null);
const personCredits = ref<any>(null);
const loading = ref(false);
const error = ref('');
const showAllMovies = ref(false);

const tmdbImageUrl = import.meta.env.VITE_TMDB_API_IMAGE_URL;

const personMovies = computed(() => {
  if (!personCredits.value) return [];
  return personCredits.value.cast
    .filter((movie: any) => movie.poster_path)
    .sort((a: any, b: any) => new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime());
});

const loadPersonDetails = async () => {
  loading.value = true;
  error.value = '';

  try {
    const personId = route.params.id as string;
    
    const [personData, creditsData] = await Promise.all([
      getPersonDetails(personId),
      getPersonMovieCredits(personId)
    ]);

    person.value = personData;
    personCredits.value = creditsData;
  } catch (e) {
    console.error('Error loading person details:', e);
    error.value = 'Erreur lors du chargement des détails de la personne';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  loadPersonDetails();
});
</script>

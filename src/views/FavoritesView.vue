<template>
  <WrapperElement>
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mes Films Préférés</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Retrouvez tous vos films aimés et vos coups de cœur
        </p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'liked'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'liked'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            ❤️ Films Aimés ({{ likedMovieIds.length }})
          </button>
          <button
            @click="activeTab = 'loved'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'loved'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            ⭐ Coups de Cœur ({{ lovedMovieIds.length }})
          </button>
          <button
            @click="activeTab = 'seen'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'seen'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            👁️ Films Vus ({{ seenMovieIds.length }})
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="mt-6">
        <!-- Liked Movies -->
        <div v-if="activeTab === 'liked'">
          <div v-if="likedMovieIds.length === 0" class="text-center py-16">
            <HeartIcon class="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun film aimé
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Commencez à aimer des films pour les retrouver ici
            </p>
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="movieId in likedMovieIds" :key="movieId" class="text-center">
              <RouterLink :to="`/movies/${movieId}`">
                <div class="bg-gray-200 dark:bg-gray-700 h-40 rounded-lg flex items-center justify-center mb-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <FilmIcon class="w-12 h-12 text-gray-400" />
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Film #{{ movieId }}</p>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Loved Movies -->
        <div v-if="activeTab === 'loved'">
          <div v-if="lovedMovieIds.length === 0" class="text-center py-16">
            <StarIcon class="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun coup de cœur
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Marquez vos films préférés comme coups de cœur
            </p>
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="movieId in lovedMovieIds" :key="movieId" class="text-center">
              <RouterLink :to="`/movies/${movieId}`">
                <div class="bg-purple-100 dark:bg-purple-900/30 h-40 rounded-lg flex items-center justify-center mb-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  <StarIcon class="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Film #{{ movieId }}</p>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Seen Movies -->
        <div v-if="activeTab === 'seen'">
          <div v-if="seenMovieIds.length === 0" class="text-center py-16">
            <EyeIcon class="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun film marqué comme vu
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Marquez des films comme vus pour suivre votre progression
            </p>
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="movieId in seenMovieIds" :key="movieId" class="text-center">
              <RouterLink :to="`/movies/${movieId}`">
                <div class="bg-green-100 dark:bg-green-900/30 h-40 rounded-lg flex items-center justify-center mb-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  <EyeIcon class="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Film #{{ movieId }}</p>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { HeartIcon, StarIcon, EyeIcon, FilmIcon } from '@heroicons/vue/24/outline';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import { getMoviesByAction } from '@/utils/movieActions';

const activeTab = ref<'liked' | 'loved' | 'seen'>('liked');

const likedMovieIds = computed(() => getMoviesByAction('liked'));
const lovedMovieIds = computed(() => getMoviesByAction('loved'));
const seenMovieIds = computed(() => getMoviesByAction('seen'));
</script>

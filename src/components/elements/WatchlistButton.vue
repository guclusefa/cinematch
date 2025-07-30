<template>
  <button
    @click="toggleWatchlist"
    :class="[
      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
      isInList
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
    ]"
    :disabled="!user"
  >
    <component 
      :is="isInList ? BookmarkIconSolid : BookmarkIcon" 
      class="w-5 h-5" 
    />
    <span>{{ isInList ? 'Dans ma liste' : 'Ajouter à ma liste' }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookmarkIcon } from '@heroicons/vue/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/vue/24/solid';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, loadWatchlist } from '@/utils/watchlist';
import { getUser } from '@/utils/auth';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
}>();

const user = getUser();

// Check if movie is in watchlist
const isInList = computed(() => isInWatchlist(props.movie.id));

const toggleWatchlist = () => {
  if (!user) {
    toast.error('Vous devez être connecté pour gérer votre liste');
    return;
  }

  if (isInList.value) {
    if (removeFromWatchlist(props.movie.id)) {
      toast.success(`"${props.movie.title}" retiré de votre liste`);
    }
  } else {
    if (addToWatchlist(props.movie)) {
      toast.success(`"${props.movie.title}" ajouté à votre liste`);
    }
  }
};

// Load watchlist on component mount
loadWatchlist();
</script>

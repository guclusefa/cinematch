<template>
    <!-- Mobile Layout (< md) -->
    <div class="md:hidden">
        <div class="grid grid-cols-3 gap-1">
            <!-- Row 1: Seen, Liked, Watchlist -->
            <button @click="toggleSeen" :class="[
                seen ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center'
            ]" :title="seen ? 'Je n\'ai pas vu' : 'Je l\'ai vu'">
                <component :is="seen ? EyeIconSolid : EyeIcon" class="w-4 h-4" />
            </button>

            <button @click="toggleLiked" :class="[
                liked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center'
            ]" :title="liked ? 'Je n\'aime plus' : 'J\'aime'">
                <component :is="liked ? HeartIconSolid : HeartIcon" class="w-4 h-4" />
            </button>

            <button @click="toggleWatchlist" :class="[
                inWatchlist ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center'
            ]" :title="inWatchlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'">
                <component :is="inWatchlist ? BookmarkIconSolid : BookmarkIcon" class="w-4 h-4" />
            </button>

            <!-- Row 2: Loved, Disliked, More Actions -->
            <button @click="toggleLoved" :class="[
                loved ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center'
            ]" :title="loved ? 'Je n\'adore plus' : 'J\'adore'">
                <component :is="loved ? StarIconSolid : StarIcon" class="w-4 h-4" />
            </button>

            <button @click="toggleDisliked" :class="[
                disliked ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center'
            ]" :title="disliked ? 'Je ne déteste plus' : 'Je n\'aime pas'">
                <component :is="disliked ? HandThumbDownIconSolid : HandThumbDownIcon" class="w-4 h-4" />
            </button>

            <!-- Movie Link Button -->
            <RouterLink :to="`/movies/${movieId}`" 
                class="p-2 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center justify-center bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                title="Voir les détails">
                <ArrowTopRightOnSquareIcon class="w-4 h-4" />
            </RouterLink>
        </div>
    </div>

    <!-- Desktop Layout (>= md) -->
    <div class="hidden md:flex items-center justify-start gap-2 flex-wrap">
        <!-- Bouton "J'ai vu / Pas vu" -->
        <button @click="toggleSeen" :class="[
            seen ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            'py-2 px-3 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center gap-2 text-sm'
        ]" :title="seen ? 'Je n\'ai pas vu' : 'Je l\'ai vu'">
            <component :is="seen ? EyeIconSolid : EyeIcon" class="w-4 h-4" />
            <span class="hidden lg:inline">{{ seen ? 'Vu' : 'Vu' }}</span>
        </button>

        <!-- Bouton "J'aime / Rien" -->
        <button @click="toggleLiked" :class="[
            liked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            'py-2 px-3 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center gap-2 text-sm'
        ]" :title="liked ? 'Je n\'aime plus' : 'J\'aime'">
            <component :is="liked ? HeartIconSolid : HeartIcon" class="w-4 h-4" />
            <span class="hidden lg:inline">{{ liked ? 'Aimé' : 'Aimer' }}</span>
        </button>

        <!-- Bouton "J'adore" -->
        <button @click="toggleLoved" :class="[
            loved ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            'py-2 px-3 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center gap-2 text-sm'
        ]" :title="loved ? 'Je n\'adore plus' : 'J\'adore'">
            <component :is="loved ? StarIconSolid : StarIcon" class="w-4 h-4" />
            <span class="hidden lg:inline">{{ loved ? 'Adoré' : 'Adorer' }}</span>
        </button>

        <!-- Bouton Watchlist -->
        <button @click="toggleWatchlist" :class="[
            inWatchlist ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            'py-2 px-3 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center gap-2 text-sm'
        ]" :title="inWatchlist ? 'Retirer de ma liste' : 'Ajouter à ma liste'">
            <component :is="inWatchlist ? BookmarkIconSolid : BookmarkIcon" class="w-4 h-4" />
            <span class="hidden lg:inline">{{ inWatchlist ? 'Dans ma liste' : 'Ma liste' }}</span>
        </button>

        <!-- Bouton "J'aime pas" (Desktop only or collapsed) -->
        <button @click="toggleDisliked" :class="[
            disliked ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            'py-2 px-3 rounded-lg shadow hover:shadow-md transition duration-300 flex items-center gap-2 text-sm'
        ]" :title="disliked ? 'Je ne déteste plus' : 'Je n\'aime pas'">
            <component :is="disliked ? HandThumbDownIconSolid : HandThumbDownIcon" class="w-4 h-4" />
            <span class="hidden xl:inline">{{ disliked ? 'Pas aimé' : 'Pas aimer' }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, onMounted } from 'vue';
import { EyeIcon, HeartIcon, StarIcon, HandThumbDownIcon, BookmarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import { EyeIcon as EyeIconSolid, HeartIcon as HeartIconSolid, StarIcon as StarIconSolid, HandThumbDownIcon as HandThumbDownIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/vue/24/solid';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, loadWatchlist } from '@/utils/watchlist';
import { getUser } from '@/utils/auth';
import { toast } from 'vue3-toastify';

const props = defineProps({
    movieId: {
        type: Number,
        required: true
    }
});

const user = getUser();
const seen = ref(false);
const liked = ref(false);
const loved = ref(false);
const disliked = ref(false);

// Local storage keys for movie actions
const getSeenKey = (movieId: number) => `movie_seen_${user?.id}_${movieId}`;
const getLikedKey = (movieId: number) => `movie_liked_${user?.id}_${movieId}`;
const getLovedKey = (movieId: number) => `movie_loved_${user?.id}_${movieId}`;
const getDislikedKey = (movieId: number) => `movie_disliked_${user?.id}_${movieId}`;

// Load all states from localStorage
const loadMovieStates = () => {
    if (!user) return;
    
    seen.value = localStorage.getItem(getSeenKey(props.movieId)) === 'true';
    liked.value = localStorage.getItem(getLikedKey(props.movieId)) === 'true';
    loved.value = localStorage.getItem(getLovedKey(props.movieId)) === 'true';
    disliked.value = localStorage.getItem(getDislikedKey(props.movieId)) === 'true';
};

// Save state to localStorage
const saveState = (key: string, value: boolean) => {
    if (!user) return;
    
    if (value) {
        localStorage.setItem(key, 'true');
    } else {
        localStorage.removeItem(key);
    }
};

// Load watchlist on component mount
loadWatchlist();

// Check if movie is in watchlist
const inWatchlist = computed(() => isInWatchlist(props.movieId));

// Load states when component mounts
onMounted(() => {
    loadMovieStates();
});

const toggleSeen = () => {
    if (!user) {
        toast.error('Vous devez être connecté pour marquer un film comme vu');
        return;
    }
    
    seen.value = !seen.value;
    saveState(getSeenKey(props.movieId), seen.value);
    
    if (seen.value) {
        toast.success('Film marqué comme vu');
    } else {
        toast.info('Film marqué comme non vu');
    }
};

const toggleLiked = () => {
    if (!user) {
        toast.error('Vous devez être connecté pour aimer un film');
        return;
    }
    
    // Clear conflicting states
    if (!liked.value) {
        if (disliked.value) {
            disliked.value = false;
            saveState(getDislikedKey(props.movieId), false);
        }
        if (loved.value) {
            loved.value = false;
            saveState(getLovedKey(props.movieId), false);
        }
    }
    
    liked.value = !liked.value;
    saveState(getLikedKey(props.movieId), liked.value);
    
    if (liked.value) {
        toast.success('Film ajouté à vos favoris');
    } else {
        toast.info('Film retiré de vos favoris');
    }
};

const toggleLoved = () => {
    if (!user) {
        toast.error('Vous devez être connecté pour adorer un film');
        return;
    }
    
    // Clear conflicting states
    if (!loved.value) {
        if (disliked.value) {
            disliked.value = false;
            saveState(getDislikedKey(props.movieId), false);
        }
        if (liked.value) {
            liked.value = false;
            saveState(getLikedKey(props.movieId), false);
        }
    }
    
    loved.value = !loved.value;
    saveState(getLovedKey(props.movieId), loved.value);
    
    if (loved.value) {
        toast.success('Film adoré! ⭐');
    } else {
        toast.info('Film retiré de vos coups de cœur');
    }
};

const toggleDisliked = () => {
    if (!user) {
        toast.error('Vous devez être connecté pour marquer un film comme non aimé');
        return;
    }
    
    // Clear conflicting states
    if (!disliked.value) {
        if (liked.value) {
            liked.value = false;
            saveState(getLikedKey(props.movieId), false);
        }
        if (loved.value) {
            loved.value = false;
            saveState(getLovedKey(props.movieId), false);
        }
    }
    
    disliked.value = !disliked.value;
    saveState(getDislikedKey(props.movieId), disliked.value);
    
    if (disliked.value) {
        toast.info('Film marqué comme non aimé');
    } else {
        toast.info('Film retiré des non aimés');
    }
};

const toggleWatchlist = () => {
    if (!user) {
        toast.error('Vous devez être connecté pour gérer votre liste');
        return;
    }

    // Create a minimal movie object for watchlist
    const movieData = {
        id: props.movieId,
        title: 'Film', // We don't have the title here, could be improved
        poster_path: null,
        release_date: '',
        vote_average: 0,
        overview: ''
    };

    if (inWatchlist.value) {
        if (removeFromWatchlist(props.movieId)) {
            toast.success('Film retiré de votre liste');
        }
    } else {
        if (addToWatchlist(movieData)) {
            toast.success('Film ajouté à votre liste');
        }
    }
};
</script>

<style scoped>
button:focus {
    outline: none;
}
</style>
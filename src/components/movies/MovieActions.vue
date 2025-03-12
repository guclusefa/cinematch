<template>
    <div class="flex items-center justify-start gap-2">
        <!-- Bouton "J'ai vu / Pas vu" -->
        <button @click="toggleSeen" :class="[
            seen ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700',
            'py-2 px-4 rounded shadow hover:shadow-md transition duration-300 flex items-center gap-2'
        ]" :title="seen ? 'Je n\'ai pas vu' : 'Je l\'ai vu'">
            <template v-if="seen">
                <EyeIconSolid class="w-5 h-5" />
            </template>
            <template v-else>
                <EyeIcon class="w-5 h-5" />
            </template>
        </button>

        <!-- Bouton "J'aime pas" -->
        <button @click="toggleDisliked" :class="[
            disliked ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700',
            'py-2 px-4 rounded shadow hover:shadow-md transition duration-300 flex items-center gap-2'
        ]" :title="disliked ? 'Je ne déteste plus' : 'Je n\'aime pas'">
            <template v-if="disliked">
                <HandThumbDownIconSolid class="w-5 h-5" />
            </template>
            <template v-else>
                <HandThumbDownIcon class="w-5 h-5" />
            </template>
        </button>

        <!-- Bouton "J'aime / Rien" -->
        <button @click="toggleLiked" :class="[
            liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700',
            'py-2 px-4 rounded shadow hover:shadow-md transition duration-300 flex items-center gap-2'
        ]" :title="liked ? 'Je n\'aime plus' : 'J\'aime'">
            <template v-if="liked">
                <HeartIconSolid class="w-5 h-5" />
            </template>
            <template v-else>
                <HeartIcon class="w-5 h-5" />
            </template>
        </button>

        <!-- Bouton "J'adore" -->
        <button @click="toggleLoved" :class="[
            loved ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700',
            'py-2 px-4 rounded shadow hover:shadow-md transition duration-300 flex items-center gap-2'
        ]" :title="loved ? 'Je n\'adore plus' : 'J\'adore'">
            <template v-if="loved">
                <StarIconSolid class="w-5 h-5" />
            </template>
            <template v-else>
                <StarIcon class="w-5 h-5" />
            </template>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import { EyeIcon, HeartIcon, StarIcon, HandThumbDownIcon } from '@heroicons/vue/24/outline';
import { EyeIcon as EyeIconSolid, HeartIcon as HeartIconSolid, StarIcon as StarIconSolid, HandThumbDownIcon as HandThumbDownIconSolid } from '@heroicons/vue/24/solid';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();

const props = defineProps({
    movieId: {
        type: Number,
        required: true
    }
});

const seen = ref(false);
const liked = ref(false);
const loved = ref(false);
const disliked = ref(false);

const fetchRating = async () => {
    try {
        const response = await api.get(`/rating/ratings/${authStore.user.id}/${props.movieId}`);
        if (response.data) {
            const rating = response.data.rating;
            liked.value = rating === 1;
            disliked.value = rating === -1;
            loved.value = rating === 2;
            seen.value = true;
        }
    } catch (error) {
        console.error('Error fetching rating:', error);
    }
};

const rateMovie = async (rating: number) => {
    try {
        await api.post('/rating/ratings', {
            user_id: authStore.user.id,
            tmdb_id: props.movieId,
            rating: rating
        });
        toast.success('Note enregistrée !');
    } catch (error) {
        console.error('Error rating movie:', error);
        toast.error('Erreur lors de l\'enregistrement de la note');
    }
};

const toggleSeen = async () => {
    seen.value = !seen.value;
    if (!seen.value) {
        liked.value = false;
        disliked.value = false;
        loved.value = false;
        await rateMovie(0);
    }
};

const toggleLiked = async () => {
    if (!seen.value) seen.value = true;
    const newValue = !liked.value;
    liked.value = newValue;
    disliked.value = false;
    loved.value = false;
    await rateMovie(newValue ? 1 : 0);
};

const toggleLoved = async () => {
    if (!seen.value) seen.value = true;
    const newValue = !loved.value;
    loved.value = newValue;
    liked.value = false;
    disliked.value = false;
    await rateMovie(newValue ? 2 : 0);
};

const toggleDisliked = async () => {
    if (!seen.value) seen.value = true;
    const newValue = !disliked.value;
    disliked.value = newValue;
    liked.value = false;
    loved.value = false;
    await rateMovie(newValue ? -1 : 0);
};

onMounted(fetchRating);
</script>

<style scoped>
button:focus {
    outline: none;
}
</style>
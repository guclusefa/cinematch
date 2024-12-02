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
import { ref, defineProps } from 'vue';
import { EyeIcon, HeartIcon, StarIcon, HandThumbDownIcon } from '@heroicons/vue/24/outline';
import { EyeIcon as EyeIconSolid, HeartIcon as HeartIconSolid, StarIcon as StarIconSolid, HandThumbDownIcon as HandThumbDownIconSolid } from '@heroicons/vue/24/solid';

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

const toggleSeen = () => {
    seen.value = !seen.value;
};

const toggleLiked = () => {
    liked.value = !liked.value;
};

const toggleLoved = () => {
    loved.value = !loved.value;
};

const toggleDisliked = () => {
    disliked.value = !disliked.value;
};
</script>

<style scoped>
button:focus {
    outline: none;
}
</style>
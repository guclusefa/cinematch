<template>
  <div class="flex items-center">
    <!-- Loop to display full stars -->
    <span v-for="i in fullStars" :key="'full-' + i" class="text-yellow-400">
      ★
    </span>
    <!-- Display half star if needed -->
    <span v-if="hasHalfStar" class="text-yellow-400">
      ☆
    </span>
    <!-- Loop to display empty stars -->
    <span v-for="i in emptyStars" :key="'empty-' + i" class="text-gray-300 dark:text-gray-600">
      ★
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
    validator: (value: unknown) => typeof value === 'number' && value >= 0 && value <= 5
  }
});

// Clamp rating between 0 and 5 to prevent invalid calculations
const clampedRating = computed(() => Math.max(0, Math.min(5, props.rating || 0)));

// Number of full stars (round down)
const fullStars = computed(() => Math.max(0, Math.floor(clampedRating.value)));

// Check if a half star is needed
const hasHalfStar = computed(() => (clampedRating.value % 1) >= 0.5);

// Number of empty stars (ensure it's never negative)
const emptyStars = computed(() => Math.max(0, 5 - fullStars.value - (hasHalfStar.value ? 1 : 0)));
</script>

<style scoped>
/* Optional styling for better appearance */
span {
  font-size: 1.25rem; /* Adjust size as needed */
  margin-right: 2px;
}
</style>
  
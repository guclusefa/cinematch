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
  import { defineProps } from 'vue';
  
  const props = defineProps({
    rating: {
      type: Number,
      required: true,
      default: 0, // Default rating if none provided
      validator: value => value >= 0 && value <= 10 // Ensure rating is between 0 and 10
    }
  });
  
  // Number of full stars (round down)
  const fullStars = computed(() => Math.floor(props.rating / 2));
  
  // Check if a half star is needed
  const hasHalfStar = computed(() => props.rating % 2 >= 0.5);
  
  // Number of empty stars
  const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0));
  </script>
  
  <style scoped>
  /* Optional styling for better appearance */
  span {
    font-size: 1.25rem; /* Adjust size as needed */
    margin-right: 2px;
  }
  </style>
  
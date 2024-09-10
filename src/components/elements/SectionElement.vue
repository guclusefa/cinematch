<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-semibold underline">{{ props.title }}</h1>
      <slot name="actions" />
    </div>
    <slot name="content" />
  </section>
</template>

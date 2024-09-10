<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';

import RegisterForm from '@/components/auth/RegisterForm.vue';

import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import { ref } from 'vue';

const loading = ref(false);
</script>

<template>
  <WrapperElement>
    <SectionElement title="Inscription">
      <template #content>
        <RegisterForm v-if="!loading" />
        <SpinnerElement large v-else />
      </template>
    </SectionElement>
  </WrapperElement>
</template>

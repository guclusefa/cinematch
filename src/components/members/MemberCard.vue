<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useMembersStore } from '@/stores/members';
import MembreDeleteButton from './MemberDeleteButton.vue';
import MembreEditButton from './MemberEditButton.vue';

import type { Member } from '@/types/member';

const props = defineProps({
  member: {
    type: Object as () => Member,
    required: true
  }
});

const membersStore = useMembersStore();
const authStore = useAuthStore();

let user: any = null;
let isMyself = false;
if (authStore.user) {
  user = authStore.user;
  isMyself = user?._id === props.member._id;
}
</script>

<template>
  <article
    class="p-4 bg-white rounded-lg shadow-xl flex flex-col gap-4 h-full dark:bg-black-lighter"
  >
    <RouterLink :to="{ name: 'member', params: { id: props.member._id } }">
      <header class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ props.member.firstName }} {{ props.member.lastName }}
        </h3>
      </header>
      <div class="flex flex-col gap-2 flex-grow">
        <p class="text-sm text-gray">{{ props.member.email }}</p>
      </div>
    </RouterLink>
    <footer class="flex items-center gap-2" v-if="isMyself">
      <MembreEditButton :member="props.member" />
      <MembreDeleteButton :member="props.member" />
    </footer>
  </article>
</template>

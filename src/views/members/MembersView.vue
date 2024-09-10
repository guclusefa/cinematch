<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MemberList from '@/components/members/MemberList.vue';
import { useMembersStore } from '@/stores/members';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const loading = ref(false);

const membersStore = useMembersStore();

onMounted(async () => {
  if (!membersStore.members.length) {
    try {
      loading.value = true;
      await membersStore.fetchMembers();
    } catch (error) {
      toast.error('Erreur lors du chargement des membres');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <WrapperElement>
    <SectionElement title="Membres">
      <template #content>
        <SpinnerElement large v-if="loading" />
        <MemberList :members="membersStore.members" v-else />
      </template>
    </SectionElement>
  </WrapperElement>
</template>

<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MemberCard from '@/components/members/MemberCard.vue';
import { useMembersStore } from '@/stores/members';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const params = router.currentRoute?.value.params;

const membersStore = useMembersStore();

onMounted(async () => {
  if (typeof params.id === 'string') {
    try {
      // delete previous to avoid flickering
      membersStore.resetMember();
      await membersStore.fetchMember(params.id);
    } catch (error) {
      toast.error('Erreur lors du chargement du membre');
    }
  }
});
</script>

<template>
  <WrapperElement>
    <template v-if="membersStore.member.firstName">
      <SectionElement :title="membersStore.member.firstName + ' ' + membersStore.member.lastName">
        <template #content>
          <MemberCard :member="membersStore.member" />
        </template>
      </SectionElement>
    </template>
    <SpinnerElement v-else />
  </WrapperElement>
</template>

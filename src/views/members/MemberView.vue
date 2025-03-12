<script setup lang="ts">
import SectionElement from '@/components/elements/SectionElement.vue';
import SpinnerElement from '@/components/elements/SpinnerElement.vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';
import MemberCard from '@/components/members/MemberCard.vue';
import UserMovieList from '@/components/members/UserMovieList.vue';
import FollowSection from '@/components/members/FollowSection.vue';
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
    <template v-if="membersStore.member.nom">
      <div class="bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/5 dark:to-transparent rounded-2xl p-1 mb-8">
        <div class="bg-white dark:bg-gray-900 rounded-xl p-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div class="relative group">
              <div class="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/20 dark:to-primary/10 
                         rounded-2xl flex items-center justify-center transform transition-all duration-300 
                         group-hover:scale-105 group-hover:shadow-lg">
                <span class="text-3xl font-bold text-primary">
                  {{ membersStore.member.prenom?.[0]?.toUpperCase() }}{{ membersStore.member.nom?.[0]?.toUpperCase() }}
                </span>
              </div>
            </div>

            <div class="flex-grow">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {{ membersStore.member.prenom }} {{ membersStore.member.nom }}
              </h1>
              <p class="text-primary font-medium mb-2">@{{ membersStore.member.pseudo }}</p>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ membersStore.member.email }}</p>
            </div>

            <div class="flex gap-4 mt-4 md:mt-0">
              <div class="px-4 py-3 bg-red-50 dark:bg-red-900/10 rounded-xl text-center transition-transform hover:scale-105">
                <p class="text-2xl font-bold text-red-500 dark:text-red-400 mb-1">{{ membersStore.member.films_aimes || 0 }}</p>
                <p class="text-sm font-medium text-red-700 dark:text-red-300">Films aimés</p>
              </div>
              <div class="px-4 py-3 bg-primary/5 dark:bg-primary/10 rounded-xl text-center transition-transform hover:scale-105">
                <p class="text-2xl font-bold text-primary mb-1">{{ membersStore.member.films_adores || 0 }}</p>
                <p class="text-sm font-medium text-primary-dark dark:text-primary-light">Films adorés</p>
              </div>
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/20 rounded-xl text-center transition-transform hover:scale-105">
                <p class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">{{ membersStore.member.films_detestes || 0 }}</p>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-200">Films détestés</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <FollowSection :userId="membersStore.member.id" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/5 dark:to-transparent rounded-2xl p-1">
        <div class="bg-white dark:bg-gray-900 rounded-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Collection de films
          </h2>
          <UserMovieList :userId="membersStore.member.id" />
        </div>
      </div>
    </template>
    <SpinnerElement v-else />
  </WrapperElement>
</template>

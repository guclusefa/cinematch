<template>
  <div class="flex flex-col gap-4">
    <div v-if="isOwnProfile" class="text-gray-600">
      C'est votre profil
    </div>
    <div v-else class="flex items-center gap-4">
      <button
        @click="toggleFollow"
        :class="[
          isFollowing ? 'bg-red-500' : 'bg-blue-500',
          'text-white px-4 py-2 rounded hover:opacity-90 transition-opacity'
        ]"
      >
        {{ isFollowing ? 'Ne plus suivre' : 'Suivre' }}
      </button>
    </div>

    <div class="flex gap-8">
      <div>
        <div class="text-lg font-semibold">{{ followersCount }}</div>
        <div class="text-gray-600">Abonnés</div>
      </div>
      <div>
        <div class="text-lg font-semibold">{{ followingCount }}</div>
        <div class="text-gray-600">Abonnements</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { toast } from '@/services/toast';
import { api } from '@/services/api';

const props = defineProps<{
  userId: number;
}>();

const route = useRoute();
const authStore = useAuthStore();

const isFollowing = ref(false);
const followersCount = ref(0);
const followingCount = ref(0);
const isOwnProfile = ref(false);

const fetchFollowStatus = async () => {
  try {
    isOwnProfile.value = authStore.user?.id === props.userId;

    const followersResponse = await api.get(`/follow/followers/${props.userId}`);
    followersCount.value = followersResponse.data.length;

    const followingResponse = await api.get(`/follow/following/${props.userId}`);
    followingCount.value = followingResponse.data.length;

    if (authStore.user) {
      const followers = followersResponse.data;
      isFollowing.value = followers.some((f: any) => f.id === authStore.user?.id);
    }
  } catch (error) {
    console.error('Error fetching follow status:', error);
    toast.error('Erreur lors de la récupération des données d\'abonnement');
  }
};

const toggleFollow = async () => {
  if (!authStore.user) {
    toast.error('Vous devez être connecté pour suivre un utilisateur');
    return;
  }

  try {
    if (isFollowing.value) {
      await api.delete(`/follow/${props.userId}`);
      followersCount.value--;
      toast.success('Vous ne suivez plus cet utilisateur');
    } else {
      await api.post('/follow', { followingId: props.userId });
      followersCount.value++;
      toast.success('Vous suivez maintenant cet utilisateur');
    }
    isFollowing.value = !isFollowing.value;
  } catch (error) {
    console.error('Error toggling follow:', error);
    toast.error('Erreur lors de la modification de l\'abonnement');
  }
};

onMounted(fetchFollowStatus);

watch(() => props.userId, fetchFollowStatus);
</script> 
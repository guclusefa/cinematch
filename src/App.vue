<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import { useAuthStore } from './stores/auth';
import { connectSocket, disconnectSocket } from './services/socket';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.getUser();
      connectSocket();
    } catch (error) {
      console.error('Error loading user:', error);
      authStore.logout();
      if (!router.currentRoute.value.meta.requiresNoAuth) {
        router.push({ name: 'login' });
      }
    }
  } else if (localStorage.getItem('token')) {
    authStore.token = localStorage.getItem('token');
    try {
      await authStore.getUser();
      connectSocket();
    } catch (error) {
      console.error('Error loading user:', error);
      authStore.logout();
      if (!router.currentRoute.value.meta.requiresNoAuth) {
        router.push({ name: 'login' });
      }
    }
  }
});

onUnmounted(() => {
  disconnectSocket();
});
</script>

<template>
  <AppHeader />
  <AppSidebar />
  <div id="container" class="h-full overflow-x-hidden z-50 flex flex-col mt-16 xl:ml-64">
    <main id="main" class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

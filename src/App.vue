<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Loading user
  if (authStore.token) {
    try {
      await authStore.getUser();
    } catch (error) {
      authStore.logout();
      router.push({ name: 'login' }).then(() => {
        window.location.reload();
      });
    }
  }
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

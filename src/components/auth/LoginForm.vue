<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const user = ref({
  pseudo: '',
  password: ''
});

const handleSubmit = async () => {
  if (!user.value.pseudo || !user.value.password) {
    toast.error("Veuillez remplir votre pseudo et votre mot de passe");
    return;
  }
  try {
    loading.value = true;
    await authStore.login({
      username: user.value.pseudo,
      password: user.value.password
    });

    toast.success('Connexion réussie');
    router.push({ name: 'home' });
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de la connexion";
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Pseudo</LabelElement>
      </template>
      <template #input>
        <InputElement :id="'pseudo'" v-model="user.pseudo" placeholder="Entrez votre pseudo" autocomplete="username" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Mot de passe</LabelElement>
      </template>
      <template #input>
        <InputElement type="password" :id="'password'" v-model="user.password" autocomplete="current-password" />
      </template>
    </InputgroupElement>
    <footer class="flex gap-2">
      <ButtonElement primary type="submit" :disabled="loading">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="loading" />
          <div>
            Se connecter
          </div>
        </div>
      </ButtonElement>
    </footer>
  </form>
</template>

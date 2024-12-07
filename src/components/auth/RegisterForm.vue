<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';
import SpinnerElement from '../elements/SpinnerElement.vue';
import api from '@/services/api';  // Import the api where createUser is defined

const router = useRouter();

const loading = ref(false);

const user = ref({
  username: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
  email: ''
});

const handleSubmit = async () => {
  // Validate user inputs
  if (!user.value.username || !user.value.password || !user.value.passwordConfirmation || !user.value.firstName || !user.value.lastName) {
    toast.error('Veuillez remplir les champs obligatoires');
    return;
  }

  // Validate passwords match
  if (user.value.password !== user.value.passwordConfirmation) {
    toast.error('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    loading.value = true;

    // Create user by calling the API function
    await api.createUser({
      email: user.value.email,
      pseudo: user.value.username,
      nom: user.value.lastName,
      prenom: user.value.firstName,
      password: user.value.password
    });

    // Redirect to home after successful registration
    router.push({ name: 'home' }).then(() => {
      toast.success('Inscription réussie, vérifiez votre boîte mail pour activer votre compte');
      // window.location.reload();
    });
  } catch (error) {
    toast.error('Cette adresse email ou nom d\'utilisateur est déjà utilisée');
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Email</LabelElement>
        </template>
        <template #input>
          <InputElement type="email" :id="'email'" v-model="user.email" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Nom d'utilisateur</LabelElement>
        </template>
        <template #input>
          <InputElement type="text" :id="'username'" v-model="user.username" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Prénom</LabelElement>
        </template>
        <template #input>
          <InputElement type="text" :id="'firstName'" v-model="user.firstName" />
        </template>
      </InputgroupElement>
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Nom</LabelElement>
        </template>
        <template #input>
          <InputElement type="text" :id="'lastName'" v-model="user.lastName" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Mot de passe</LabelElement>
        </template>
        <template #input>
          <InputElement type="password" :id="'password'" v-model="user.password" />
        </template>
      </InputgroupElement>
      <InputgroupElement class="flex-1">
        <template #label>
          <LabelElement>Confirmation du mot de passe</LabelElement>
        </template>
        <template #input>
          <InputElement type="password" :id="'passwordConfirmation'" v-model="user.passwordConfirmation" />
        </template>
      </InputgroupElement>
    </div>
    <div class="flex items-center gap-2">
      <input type="checkbox" class="form-checkbox" />
      <span class="text-sm text-gray">Accepter les conditions d'utilisation</span>
    </div>
    <footer class="flex gap-2">
      <ButtonElement primary type="submit">
        <div class="flex items-center gap-2">
          <SpinnerElement v-if="loading" />
          <div>S'inscrire</div>
        </div>
      </ButtonElement>
    </footer>
  </form>
</template>

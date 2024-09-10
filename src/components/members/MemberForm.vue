<script setup lang="ts">
import InputElement from '@/components/elements/InputElement.vue';
import InputgroupElement from '@/components/elements/InputgroupElement.vue';
import LabelElement from '@/components/elements/LabelElement.vue';
import router from '@/router';
import { useMembersStore } from '@/stores/members';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import ButtonElement from '../elements/ButtonElement.vue';

import type { Member } from '@/types/Member';

const props = defineProps({
  member: {
    type: Object as () => Member,
    required: false
  },
  okText: {
    type: String,
    default: 'Valider'
  },
  edit: {
    type: Boolean,
    default: false
  }
});

const memberRef = ref<Member>({
  firstName: '',
  lastName: ''
});

if (props.member) {
  memberRef.value = props.member;
}

const $emit = defineEmits(['close']);

const membersStore = useMembersStore();

const handleSubmit = async () => {
  // Check if all fields are filled
  if (!memberRef.value.firstName || !memberRef.value.lastName) {
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  try {
    // Update or create
    if (props.edit && memberRef.value._id) {
      await membersStore.updateMember(memberRef.value);
    } else {
      await membersStore.createMember(memberRef.value);
    }
    // Display success message
    toast.success(props.edit ? 'Membre modifié avec succès' : 'Membre ajouté avec succès');

    // close modal if we are in one
    $emit('close');

    // Refresh list & redirect
    await membersStore.fetchMembers();
    router.push({ name: 'members' });
  } catch (error) {
    // Display error message
    toast.error(
      props.edit
        ? 'Une erreur est survenue lors de la modification du membre'
        : "Une erreur est survenue lors de l'ajout du membre"
    );
  }
};
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <InputgroupElement>
      <template #label>
        <LabelElement>Nom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="memberRef.firstName" :id="'firstName'" />
      </template>
    </InputgroupElement>
    <InputgroupElement>
      <template #label>
        <LabelElement>Prénom</LabelElement>
      </template>
      <template #input>
        <InputElement v-model="memberRef.lastName" :id="'lastName'" />
      </template>
    </InputgroupElement>
    <footer class="flex justify-end gap-2 mt-16">
      <ButtonElement @click="$emit('close')">Annuler</ButtonElement>
      <ButtonElement primary type="submit">{{ okText }}</ButtonElement>
    </footer>
  </form>
</template>

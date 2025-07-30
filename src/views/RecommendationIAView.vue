<template>
  <WrapperElement>
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 Recommandation IA
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Discutez avec notre expert IA en cinéma pour obtenir des recommandations personnalisées
        </p>
      </div>

      <!-- Zone de conversation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
          Commencez une conversation ! Demandez-moi des recommandations de films 🎬
        </div>
        
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div v-if="message.from === 'user'" class="flex justify-end">
            <div class="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
              {{ message.content }}
            </div>
          </div>
          <div v-else class="flex justify-start">
            <div class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
              <div v-if="Array.isArray(message.content)">
                <div v-for="(item, i) in message.content" :key="i" class="mb-2">
                  {{ item }}
                </div>
              </div>
              <div v-else>
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-start">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span class="text-gray-600 dark:text-gray-300">L'IA réfléchit...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone de saisie -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div class="flex space-x-2">
          <input
            v-model="prompt"
            @keyup.enter="getRecommendation"
            type="text"
            placeholder="Quel type de film cherchez-vous ? Genre, acteur, réalisateur..."
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            :disabled="loading"
          />
          <button
            @click="getRecommendation"
            :disabled="loading || !prompt.trim()"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {{ loading ? 'Envoi...' : 'Envoyer' }}
          </button>
        </div>
        
        <div v-if="error" class="mt-2 text-red-500 text-sm">
          {{ error }}
        </div>
        
        <div class="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Appuyez sur Entrée pour envoyer</span>
          <button
            v-if="messages.length > 0"
            @click="clearConversation"
            class="text-red-500 hover:text-red-700 transition-colors"
          >
            Effacer la conversation
          </button>
        </div>
      </div>
    </div>
  </WrapperElement>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';

const prompt = ref('');
const loading = ref(false);
const error = ref('');
const messages = ref<{ from: 'user' | 'bot', content: string | any[] }[]>([]);

// Configuration X.AI API
const XAI_API = 'https://api.x.ai/v1/chat/completions';
const XAI_KEY = import.meta.env.VITE_XAI_API_KEY;

// Conversation context pour maintenir le contexte
const conversationHistory = ref<{ role: string; content: string }[]>([
  {
    role: 'system',
    content: 'Tu es un expert passionné de cinéma et un critique de films expérimenté. Tu connais tous les genres, réalisateurs, acteurs, et tu peux faire des recommandations personnalisées très précises. Tu peux discuter de films récents et classiques, expliquer les techniques cinématographiques, analyser les performances d\'acteurs, et donner des avis détaillés. Réponds de manière conversationnelle, enthousiaste et informative. Tu peux poser des questions pour mieux comprendre les goûts de la personne et donner des recommandations ultra-personnalisées.'
  }
]);

async function getRecommendation() {
  if (!prompt.value.trim()) return;

  const userMessage = prompt.value;
  messages.value.push({ from: 'user', content: userMessage });
  conversationHistory.value.push({ role: 'user', content: userMessage });
  
  loading.value = true;
  error.value = '';

  try {
    const success = await tryXAI();
    
    if (!success) {
      const fallbackResponse = "Désolé, j'ai des difficultés techniques en ce moment. Mais je peux quand même vous dire que je suis passionné de cinéma ! Pouvez-vous me dire quel genre de films vous aimez ? Action, drame, comédie, science-fiction ?";
      messages.value.push({ from: 'bot', content: fallbackResponse });
      conversationHistory.value.push({ role: 'assistant', content: fallbackResponse });
    }
  } catch (e) {
    console.error('Error in getRecommendation:', e);
    error.value = 'Une erreur est survenue lors de la génération de la recommandation.';
  } finally {
    loading.value = false;
    prompt.value = '';
  }
}

async function tryXAI(): Promise<boolean> {
  if (!XAI_KEY) {
    console.warn('X.AI API key not configured');
    return false;
  }

  try {
    const response = await fetch(XAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4-latest',
        messages: conversationHistory.value,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`X.AI API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    messages.value.push({ from: 'bot', content: botResponse });
    conversationHistory.value.push({ role: 'assistant', content: botResponse });
    
    return true;
  } catch (e) {
    console.error('X.AI API Error:', e);
    return false;
  }
}

function clearConversation() {
  messages.value = [];
  conversationHistory.value = [
    {
      role: 'system',
      content: 'Tu es un expert passionné de cinéma et un critique de films expérimenté. Tu connais tous les genres, réalisateurs, acteurs, et tu peux faire des recommandations personnalisées très précises. Tu peux discuter de films récents et classiques, expliquer les techniques cinématographiques, analyser les performances d\'acteurs, et donner des avis détaillés. Réponds de manière conversationnelle, enthousiaste et informative. Tu peux poser des questions pour mieux comprendre les goûts de la personne et donner des recommandations ultra-personnalisées.'
    }
  ];
  error.value = '';
}
</script>

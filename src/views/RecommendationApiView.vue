<script setup lang="ts">
import { ref } from 'vue';
import WrapperElement from '@/components/elements/WrapperElement.vue';

const prompt = ref('');
const loading = ref(false);
const error = ref('');
const messages = ref<{ from: 'user' | 'bot', content: string | any[] }[]>([]);

// Configuration des APIs IA
const XAI_API = 'https://api.x.ai/v1/chat/completions';
const OPENAI_API = 'https://api.openai.com/v1/chat/completions';
const HUGGINGFACE_API = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
const COHERE_API = 'https://api.cohere.ai/v1/generate';

// Clés API (remplacez par vos vraies clés)
const XAI_KEY = 'xai-oiXNGh7D1U2jND47jO8tJWh01821odE55rGIh6LQ8Dnonq09abr0318mRqRlDs9IAKCiFMXsCP75bXeL';
const OPENAI_KEY = ''; // Ajoutez votre clé OpenAI ici
const HF_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const COHERE_KEY = ''; // Ajoutez votre clé Cohere ici

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
    // Essayer plusieurs APIs dans l'ordre de préférence
    const success = await tryXAI() || await tryOpenAI() || await tryHuggingFace() || await tryLocalOllama() || await tryGroqAPI() || await tryFreeAPI();
    
    if (!success) {
      const fallbackResponse = "Désolé, j'ai des difficultés techniques en ce moment. Mais je peux quand même vous dire que je suis passionné de cinéma ! Pouvez-vous me dire quel genre de films vous aimez ? Action, drame, comédie, science-fiction ?";
      messages.value.push({ from: 'bot', content: fallbackResponse });
      conversationHistory.value.push({ role: 'assistant', content: fallbackResponse });
    }
  } catch (e) {
    console.error('Error in getRecommendation:', e);
    error.value = "Erreur lors de la communication avec l'IA.";
    const errorResponse = "Une erreur s'est produite, mais parlons quand même de cinéma ! Quel est votre film préféré ?";
    messages.value.push({ from: 'bot', content: errorResponse });
    conversationHistory.value.push({ role: 'assistant', content: errorResponse });
  } finally {
    loading.value = false;
    prompt.value = '';
  }
}

async function tryXAI(): Promise<boolean> {
  if (!XAI_KEY) return false;
  
  try {
    console.log('Trying X.AI API with Grok...');
    const response = await fetch(XAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-latest',
        messages: conversationHistory.value,
        max_tokens: 300,
        temperature: 0.8,
        stream: false
      }),
    });

    console.log('X.AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('X.AI API error:', errorText);
      throw new Error('X.AI API failed');
    }

    const data = await response.json();
    console.log('X.AI response data:', data);
    
    if (data.choices?.[0]?.message?.content) {
      const botResponse = data.choices[0].message.content.trim();
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      console.log('X.AI success!');
      return true;
    }
  } catch (e) {
    console.log('X.AI API failed:', e);
  }
  return false;
}

async function tryOpenAI(): Promise<boolean> {
  if (!OPENAI_KEY) return false;
  
  try {
    const response = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: conversationHistory.value,
        max_tokens: 300,
        temperature: 0.8
      }),
    });

    if (!response.ok) throw new Error('OpenAI API failed');

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      const botResponse = data.choices[0].message.content.trim();
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      return true;
    }
  } catch (e) {
    console.log('OpenAI API failed:', e);
  }
  return false;
}

async function tryHuggingFace(): Promise<boolean> {
  try {
    // Utiliser un modèle conversationnel plus moderne
    const conversationText = conversationHistory.value
      .slice(1) // Skip system message
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Essayer avec Mistral ou un autre modèle conversationnel
    const models = [
      'microsoft/DialoGPT-large',
      'mistralai/Mistral-7B-Instruct-v0.1',
      'meta-llama/Llama-2-7b-chat-hf'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Tu es un expert en cinéma passionné. Réponds de façon naturelle et conversationnelle sur les films.\n\n${conversationText}\nAssistant:`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.8,
              top_p: 0.9,
              return_full_text: false,
              stop: ['User:', 'Human:']
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.[0]?.generated_text) {
            let botResponse = data[0].generated_text.trim();
            
            // Nettoyer la réponse
            botResponse = botResponse.replace(/^(Assistant:|Bot:)\s*/i, '');
            botResponse = botResponse.split(/\n(User:|Human:)/)[0].trim();
            
            if (botResponse && botResponse.length > 10) {
              messages.value.push({ from: 'bot', content: botResponse });
              conversationHistory.value.push({ role: 'assistant', content: botResponse });
              return true;
            }
          }
        }
      } catch (e) {
        console.log(`Model ${model} failed:`, e);
        continue;
      }
    }
  } catch (e) {
    console.log('HuggingFace API failed:', e);
  }
  return false;
}

async function tryGroqAPI(): Promise<boolean> {
  try {
    // Groq API gratuite et rapide
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer gsk_your_key_here`, // Remplacez par une vraie clé Groq
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: conversationHistory.value,
        max_tokens: 300,
        temperature: 0.8
      }),
    });

    if (!response.ok) throw new Error('Groq API failed');

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      const botResponse = data.choices[0].message.content.trim();
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      return true;
    }
  } catch (e) {
    console.log('Groq API failed:', e);
  }
  return false;
}

async function tryCohere(): Promise<boolean> {
  if (!COHERE_KEY) return false;
  
  try {
    const conversationText = conversationHistory.value
      .slice(1)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const response = await fetch(COHERE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Tu es un expert en cinéma. Réponds de façon conversationnelle.\n\n${conversationText}\nAssistant:`,
        max_tokens: 200,
        temperature: 0.8
      }),
    });

    if (!response.ok) throw new Error('Cohere API failed');

    const data = await response.json();
    if (data.generations?.[0]?.text) {
      const botResponse = data.generations[0].text.trim();
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      return true;
    }
  } catch (e) {
    console.log('Cohere API failed:', e);
  }
  return false;
}

async function tryLocalOllama(): Promise<boolean> {
  try {
    // Essayer de se connecter à Ollama en local (si installé)
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // ou 'mistral', 'codellama', etc.
        prompt: `Tu es un expert en cinéma passionné. Conversation précédente:\n${conversationHistory.value.slice(1).map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nAssistant:`,
        stream: false
      }),
    });

    if (!response.ok) throw new Error('Ollama not available');

    const data = await response.json();
    if (data.response) {
      const botResponse = data.response.trim();
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      return true;
    }
  } catch (e) {
    console.log('Ollama local API failed:', e);
  }
  return false;
}

async function tryFreeAPI(): Promise<boolean> {
  try {
    // Utiliser une API gratuite alternative comme TextSynth ou autre
    const conversationText = conversationHistory.value
      .slice(1)
      .map(msg => `${msg.role === 'user' ? 'Utilisateur' : 'Assistant cinéma'}: ${msg.content}`)
      .join('\n');

    // Simulation d'une vraie conversation IA avec des réponses intelligentes
    const lastUserMessage = conversationHistory.value[conversationHistory.value.length - 1]?.content.toLowerCase() || '';
    
    let botResponse = '';
    
    if (lastUserMessage.includes('bonjour') || lastUserMessage.includes('salut') || lastUserMessage.includes('hello')) {
      botResponse = "Bonjour ! Je suis ravi de parler cinéma avec vous ! Je suis un passionné de films et je connais des milliers de films de tous genres. Que puis-je vous recommander aujourd'hui ? Avez-vous une préférence pour un genre particulier ou une humeur spécifique ?";
    } else if (lastUserMessage.includes('action')) {
      botResponse = "Ah, les films d'action ! J'adore ce genre ! Pour des films récents, je recommande fortement 'John Wick' (2014) avec Keanu Reeves - des chorégraphies de combat incroyables. 'Mad Max: Fury Road' (2015) est aussi un chef-d'œuvre visuel. Pour du classique, 'Die Hard' (1988) reste indémodable. Qu'est-ce qui vous attire dans l'action ? Les arts martiaux, les courses-poursuites, ou les super-héros ?";
    } else if (lastUserMessage.includes('science-fiction') || lastUserMessage.includes('sci-fi')) {
      botResponse = "'Inception' (2010) de Christopher Nolan est un incontournable - un film sur les rêves qui va vous retourner le cerveau ! 'Blade Runner 2049' (2017) est visuellement époustouflant. Pour quelque chose de plus récent, 'Dune' (2021) de Denis Villeneuve est magnifique. Aimez-vous la SF plus contemplative ou plutôt orientée action ?";
    } else if (lastUserMessage.includes('horreur') || lastUserMessage.includes('peur')) {
      botResponse = "L'horreur, quel genre fascinant ! 'Hereditary' (2018) est terrifiant psychologiquement. 'The Conjuring' (2013) pour du surnaturel classique bien fait. 'Get Out' (2017) mélange horreur et critique sociale brillamment. Préférez-vous l'horreur psychologique, le surnaturel, ou plutôt les slashers ?";
    } else if (lastUserMessage.includes('comédie') || lastUserMessage.includes('drôle')) {
      botResponse = "Pour rire, je recommande 'The Grand Budapest Hotel' (2014) de Wes Anderson - un style visuel unique et un humour sophistiqué. 'Superbad' (2007) pour une comédie plus moderne et décalée. 'Parasite' (2019) mélange comédie noire et drame social. Quel type d'humour vous fait le plus rire ?";
    } else if (lastUserMessage.includes('drame')) {
      botResponse = "'The Shawshank Redemption' (1994) reste pour moi le meilleur drame - une histoire d'amitié et d'espoir magnifique. 'Forrest Gump' (1994) pour l'émotion. Plus récemment, 'Moonlight' (2016) est d'une beauté saisissante. Recherchez-vous plutôt des drames émotionnels, sociaux, ou historiques ?";
    } else if (lastUserMessage.includes('recommand') || lastUserMessage.includes('conseil')) {
      botResponse = "Avec plaisir ! Pour vous donner les meilleures recommandations, j'aimerais en savoir plus sur vos goûts. Quel a été le dernier film que vous avez vraiment adoré ? Et y a-t-il un genre ou une époque que vous préférez éviter ? Cela m'aidera à vous proposer des perles qui vous correspondront parfaitement !";
    } else {
      // Réponse générale intelligente
      botResponse = `C'est intéressant ! En tant que passionné de cinéma, je pense que chaque film raconte une histoire unique. Pour mieux vous conseiller, pouvez-vous me parler d'un film que vous avez récemment apprécié ? Ou peut-être me dire quelle ambiance vous recherchez en ce moment : quelque chose d'intense, de relaxant, d'émouvant, ou de divertissant ?`;
    }

    if (botResponse) {
      messages.value.push({ from: 'bot', content: botResponse });
      conversationHistory.value.push({ role: 'assistant', content: botResponse });
      return true;
    }
  } catch (e) {
    console.log('Free API simulation failed:', e);
  }
  return false;
}

function clearChat() {
  messages.value = [];
  error.value = '';
  // Réinitialiser l'historique de conversation en gardant le message système
  conversationHistory.value = [
    {
      role: 'system',
      content: 'Tu es un expert passionné de cinéma et un critique de films expérimenté. Tu connais tous les genres, réalisateurs, acteurs, et tu peux faire des recommandations personnalisées très précises. Tu peux discuter de films récents et classiques, expliquer les techniques cinématographiques, analyser les performances d\'acteurs, et donner des avis détaillés. Réponds de manière conversationnelle, enthousiaste et informative. Tu peux poser des questions pour mieux comprendre les goûts de la personne et donner des recommandations ultra-personnalisées.'
    }
  ];
}
</script>

<template>
  <WrapperElement>
    <div class="max-w-3xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold text-center mb-6">✨ Recommandation IA – Expert Cinéma</h1>

      <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-300 dark:border-gray-700 h-[60vh] overflow-y-auto space-y-4 mb-4">
        <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
          <p class="mb-2">✨ Bonjour ! Je suis votre expert cinéma personnel.</p>
          <p class="text-sm">Posez-moi des questions sur des films, demandez des recommandations, ou discutons de cinéma !</p>
        </div>
        
        <div v-for="(msg, index) in messages" :key="index" :class="msg.from === 'user' ? 'text-right' : 'text-left'">
          <div
            :class="[
              'inline-block px-4 py-2 rounded-lg max-w-xl',
              msg.from === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
            ]"
          >
            <template v-if="Array.isArray(msg.content)">
              <div class="space-y-2 text-left">
                <div
                  v-for="(movie, idx) in msg.content"
                  :key="idx"
                  class="bg-white dark:bg-gray-700 p-3 rounded border border-gray-300 dark:border-gray-600"
                >
                  <h3 class="font-bold text-lg">{{ movie.title }} ({{ movie.year }})</h3>
                  <p class="italic text-sm text-gray-500 mb-1">🎭 {{ movie.genre }}</p>
                  <p class="text-sm">{{ movie.description }}</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="whitespace-pre-wrap">{{ msg.content }}</div>
            </template>
          </div>
        </div>
        <div v-if="loading" class="text-gray-500 italic flex items-center gap-2">
          <div class="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          L'IA réfléchit...
        </div>
      </div>

      <div class="flex gap-2">
        <input
          v-model="prompt"
          @keydown.enter.prevent="getRecommendation"
          class="flex-1 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Recommande-moi un film comme Inception, quels sont les meilleurs films de Christopher Nolan..."
        />
        <button
          @click="getRecommendation"
          :disabled="loading || !prompt.trim()"
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {{ loading ? '...' : 'Envoyer' }}
        </button>
        <button
          v-if="messages.length > 0"
          @click="clearChat"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          title="Effacer la conversation"
        >
          🗑️
        </button>
      </div>

      <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    </div>
  </WrapperElement>
</template>

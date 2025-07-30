<script setup lang="ts">
import {
  isAppSidebarToggled,
  toggleAppSidebar,
  toggleAppSidebarWithTransition,
  toggleAppSidebarWithTransitionOnMobile
} from '@/utils/app';
import { 
  HomeIcon, 
  UsersIcon, 
  FilmIcon, 
  FireIcon, 
  StarIcon, 
  CalendarIcon, 
  PlayIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  SparklesIcon,
  BookmarkIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';
import {
  HomeIcon as HomeIconSolid, 
  UsersIcon as UsersIconSolid, 
  FilmIcon as FilmIconSolid,
  FireIcon as FireIconSolid,
  StarIcon as StarIconSolid,
  CalendarIcon as CalendarIconSolid,
  PlayIcon as PlayIconSolid,
  RectangleGroupIcon as RectangleGroupIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  AdjustmentsHorizontalIcon as AdjustmentsHorizontalIconSolid,
  HeartIcon as HeartIconSolid,
  SparklesIcon as SparklesIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/vue/24/solid';
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import WrapperElement from './elements/WrapperElement.vue';
import LocaleChooser from './fragments/LocaleChooser.vue';
import ThemeSwitcher from './fragments/ThemeSwitcher.vue';

function watchEscapeKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAppSidebarToggled() && window.innerWidth < 1280) {
      toggleAppSidebarWithTransition();
    }
  });
}

onMounted(() => {
  if (window.innerWidth < 1280 || !isAppSidebarToggled()) {
    toggleAppSidebar();
  }
  watchEscapeKey();
});

const mainNavLinks = [
  {
    name: 'home',
    label: 'Accueil',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    needsAuth: false
  },
  {
    name: 'discover-movies',
    label: 'Découvrir',
    icon: AdjustmentsHorizontalIcon,
    iconSolid: AdjustmentsHorizontalIconSolid,
    needsAuth: false
  },
  {
    name: 'trending-movies',
    label: 'Tendances',
    icon: FireIcon,
    iconSolid: FireIconSolid,
    needsAuth: false
  },
  {
    name: 'top-rated-movies',
    label: 'Mieux Notés',
    icon: StarIcon,
    iconSolid: StarIconSolid,
    needsAuth: false
  },
  {
    name: 'now-playing-movies',
    label: 'Au Cinéma',
    icon: PlayIcon,
    iconSolid: PlayIconSolid,
    needsAuth: false
  },
  {
    name: 'upcoming-movies',
    label: 'À Venir',
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
    needsAuth: false
  },
  {
    name: 'movie-genres',
    label: 'Genres',
    icon: RectangleGroupIcon,
    iconSolid: RectangleGroupIconSolid,
    needsAuth: false
  },
  {
    name: 'watchlist',
    label: 'Ma Liste',
    icon: BookmarkIcon,
    iconSolid: BookmarkIconSolid,
    needsAuth: true
  },
  {
    name: 'stats',
    label: 'Mes Statistiques',
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    needsAuth: true
  },
  {
    name: 'favorites',
    label: 'Mes Favoris',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
    needsAuth: true
  }
];

const recommendationLinks = [
  {
    name: 'recommendation',
    label: 'Recommandation',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
    needsAuth: false
  },
  {
    name: 'recommendation-ia',
    label: 'Recommandation IA',
    icon: SparklesIcon,
    iconSolid: SparklesIconSolid,
    needsAuth: false
  }
];

const useAuth = useAuthStore();

let user: any = null;
if (useAuth.user) {
  user = useAuth.user;
}
</script>

<template>
  <aside id="sidebar"
    class="fixed top-16 left-0 bottom-0 w-64 !max-w-[100%] z-[99] bg-white dark:bg-black-lightend shadow dark:shadow-[0_0_10px_#000000]">
    <WrapperElement class="h-full overflow-x-hidden overflow-y-auto">
      <nav class="h-full flex flex-col justify-between gap-5">
        <div class="space-y-6">
          <!-- Main Navigation -->
          <ul class="flex flex-col gap-2">
            <li v-for="link in mainNavLinks" :key="link.name">
              <RouterLink v-if="(link.needsAuth && useAuth.user && user._id) || !link.needsAuth" :to="{ name: link.name }"
                class="flex items-center gap-2 p-2 rounded hover:bg-white-darker dark:hover:bg-black-lightest"
                active-class="bg-white-darkend dark:bg-black-lighter" @click="toggleAppSidebarWithTransitionOnMobile"
                v-slot="{ isActive }">
                <component :is="isActive ? link.iconSolid : link.icon" class="w-5 h-5 text-secondary dark:text-primary" />
                <span>{{ link.label }}</span>
              </RouterLink>
            </li>
          </ul>

          <!-- Separator -->
          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Recommendation Section -->
          <div>
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              Recommandations
            </h3>
            <ul class="flex flex-col gap-2">
              <li v-for="link in recommendationLinks" :key="link.name">
                <RouterLink v-if="(link.needsAuth && useAuth.user && user._id) || !link.needsAuth" :to="{ name: link.name }"
                  class="flex items-center gap-2 p-2 rounded hover:bg-white-darker dark:hover:bg-black-lightest"
                  active-class="bg-white-darkend dark:bg-black-lighter" @click="toggleAppSidebarWithTransitionOnMobile"
                  v-slot="{ isActive }">
                  <component :is="isActive ? link.iconSolid : link.icon" class="w-5 h-5 text-secondary dark:text-primary" />
                  <span>{{ link.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Settings -->
        <ul class="flex items-center justify-between gap-3">
          <div class="flex items-center">
            <li>
              <ThemeSwitcher />
            </li>
          </div>
          <div class="flex items-center">
            <li>
              <LocaleChooser />
            </li>
          </div>
        </ul>
      </nav>
    </WrapperElement>
  </aside>
  <Teleport to="body">
    <div class="sidebar-overlay" @click="toggleAppSidebarWithTransition" />
  </Teleport>
</template>

<style>
@media (max-width: 1280px) {
  .sidebar-toggled .sidebar-overlay {
    z-index: 98;
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }

  .dark .sidebar-toggled .sidebar-overlay {
    background-color: rgba(251, 250, 253, 0.132);
  }
}
</style>

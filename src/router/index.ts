import { createRouter, createWebHistory } from 'vue-router';

import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';

import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';

import MembersView from '@/views/members/MembersView.vue';
import MemberView from '@/views/members/MemberView.vue';

import { useAuthStore } from '@/stores/auth';
import { setDocumentTitle } from '@/utils/document';

import { toast } from 'vue3-toastify';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    // AUTH
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresNoAuth: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        requiresNoAuth: true
      }
    },
    // MEMBERS
    {
      path: '/members',
      name: 'members',
      component: MembersView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/members/:id',
      name: 'member',
      component: MemberView,
      meta: {
        requiresAuth: true
      }
    },
    // MOVIES
    {
      path: '/movies/:id',
      name: 'movie',
      component: () => import('@/views/movies/MovieView.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isFullyAuthenticated && token) {
      next();
    } else if (!authStore.isFullyAuthenticated && !token) {
      next({ name: 'login' });
      toast.error('Vous devez être connecté pour accéder à cette page');
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresNoAuth)) {
    if (authStore.isFullyAuthenticated) {
      next({ name: 'home' });
      toast.error('Vous êtes déjà connecté');
    } else {
      next();
    }
  } else {
    setDocumentTitle(String(to.name));
    next();
  }
});

export default router;

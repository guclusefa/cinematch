import { createRouter, createWebHistory } from 'vue-router';

import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import RecommendationView from '@/views/RecommendationView.vue';
import RecommendationApiView from '@/views/RecommendationApiView.vue'

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
    {
      path: '/recommendation',
      name: 'recommendation',
      component: RecommendationView
    },
    {
      path: '/recommendation-api',
      name: 'recommendation-api',
      component: RecommendationApiView
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
      component: () => import('@/views/movies/MovieView.vue'),
    },
  ]
});

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // If the user is not authenticated
    if (!authStore.isFullyAuthenticated) {
      // Redirect to the login page
      next({ name: 'login' });
      toast.error('Vous devez être connecté pour accéder à cette page');
    }
  } else if (to.matched.some((record) => record.meta.requiresNoAuth)) {
    console.log(authStore.isFullyAuthenticated);
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

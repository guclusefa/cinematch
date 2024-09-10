import { createRouter, createWebHistory } from 'vue-router';

import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';

import MembersView from '../views/members/MembersView.vue';
import MemberView from '../views/members/MemberView.vue';

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
    // AUTH
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
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
    }
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
  } else {
    setDocumentTitle(String(to.name));
    next();
  }
});

export default router;

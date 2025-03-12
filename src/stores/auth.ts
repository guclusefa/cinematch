import { api } from '@/services/api';
import { connectSocket, disconnectSocket } from '@/services/socket';
import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  pseudo: string;
  nom: string;
  prenom: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await api.post('/user/login', {
          pseudo: credentials.username,
          password: credentials.password
        });

        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (this.user) {
          connectSocket(this.user.id);
        }

        return response.data;
      } catch (error) {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
      }
    },

    async getUser() {
      try {
        const response = await api.get('/user/me');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } catch (error) {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
      }
    },

    async register(credentials: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
    }) {
      try {
        const body = {
          pseudo: credentials.username,
          password: credentials.password,
          email: credentials.email,
          nom: credentials.lastName,
          prenom: credentials.firstName
        };

        const response = await api.post('/user', body);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }

        const formattedCreditionals = {
          username: credentials.username,
          password: credentials.password
        };

        await this.login(formattedCreditionals);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      if (this.user) {
        disconnectSocket();
      }
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isFullyAuthenticated: (state) => !!state.token && !!state.user
  }
});

import api from '@/services/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        // Request
        const response = await api.post('/auth/login', credentials);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
        // Response
        const { token } = response.data;
        this.token = token;
        localStorage.setItem('token', token); // Save token to local storage

        // Get user
        await this.getUser();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getUser() {
      try {
        const response = await api.get('/me');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user)); // Save user to local storage
      } catch (error) {
        console.error(error);
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
        // formattage car yanis sait pas coder
        const body = {
          username: credentials.username,
          password: credentials.password,
          workerData: {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email
          }
        };

        // Request
        const response = await api.post('/auth/register', body);
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Invalid response');
        }
        // Login after registration

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
      this.token = '';
      this.user = '';
      localStorage.removeItem('token'); // Remove token from local storage
      localStorage.removeItem('user'); // Remove user from local storage
    }
  }
});

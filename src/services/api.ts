import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData);
    localStorage.setItem('user', JSON.stringify(response.data));

    const { user } = response.data;
    const leUser = JSON.stringify(user[0]);
    localStorage.setItem('user', leUser);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/user', userData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoggedInUser = async () => {
  if (!localStorage.getItem('user')) {
    return null;
  }
  return JSON.parse(localStorage.getItem('user'));
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const rateMovie = async (userId, movieId, rating) => {
  try {
    const response = await api.post('/ratings', {
      userId,
      movieId,
      rating
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getRecommendations = async (userId) => {
  try {
    const response = await api.get(`/recommendations/${userId}`);
    return response.data.recommendations;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  createUser,
  loginUser,
  getLoggedInUser,
  logoutUser,
  rateMovie,
  getRecommendations
};

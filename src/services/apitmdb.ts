import axios from 'axios';

const apitmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    language: 'fr-FR'
  }
});

apitmdb.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// REQUESTS
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/popular`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await apitmdb.get(`/search/movie`, {
      params: { query, page },
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMovieDetails = async (id: string | number) => {
  try {
    const response = await apitmdb.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default apitmdb;

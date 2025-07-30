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

// NEW ENDPOINTS FOR EXPANDED FUNCTIONALITY

export const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await apitmdb.get(`/trending/movie/${timeWindow}`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/top_rated`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/upcoming`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/now_playing`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMovieGenres = async () => {
  try {
    const response = await apitmdb.get(`/genre/movie/list`);
    return response.data.genres;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMoviesByGenre = async (genreId: number, page = 1) => {
  try {
    const response = await apitmdb.get(`/discover/movie`, {
      params: { 
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMovieCredits = async (movieId: string | number) => {
  try {
    const response = await apitmdb.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPersonDetails = async (personId: string | number) => {
  try {
    const response = await apitmdb.get(`/person/${personId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPersonMovieCredits = async (personId: string | number) => {
  try {
    const response = await apitmdb.get(`/person/${personId}/movie_credits`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSimilarMovies = async (movieId: string | number, page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/${movieId}/similar`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMovieRecommendations = async (movieId: string | number, page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/${movieId}/recommendations`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMovieReviews = async (movieId: string | number, page = 1) => {
  try {
    const response = await apitmdb.get(`/movie/${movieId}/reviews`, {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchPeople = async (query: string, page = 1) => {
  try {
    const response = await apitmdb.get(`/search/person`, {
      params: { query, page }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const discoverMovies = async (params: any) => {
  try {
    const response = await apitmdb.get(`/discover/movie`, {
      params: { ...params, sort_by: 'popularity.desc' }
    });
    return response.data.results;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default apitmdb;

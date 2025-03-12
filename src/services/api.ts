import axios from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new ApiError('Request failed', undefined, error));
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
    const status = error.response?.status;
    return Promise.reject(new ApiError(message, status, error.response?.data));
  }
);

export const createUser = async (userData: any) => {
  try {
    const response = await api.post('/user', userData);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to create user');
  }
};

export const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await api.post('/login', {
      pseudo: credentials.username,
      password: credentials.password
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to login');
  }
};

export const getLoggedInUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to get logged in user');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  api,
  createUser,
  loginUser,
  getLoggedInUser,
  logoutUser
};

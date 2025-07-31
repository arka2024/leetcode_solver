import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Problems API
export const problemsAPI = {
  getProblems: (params?: any) => api.get('/problems', { params }),
  getProblem: (slug: string) => api.get(`/problems/${slug}`),
  createProblem: (data: any) => api.post('/problems', data),
  updateProblem: (id: string, data: any) => api.put(`/problems/${id}`, data),
  getProblemStats: (slug: string) => api.get(`/problems/${slug}/stats`),
};

// Submissions API
export const submissionsAPI = {
  submitCode: (data: { problemId: string; code: string; language: string }) =>
    api.post('/submissions', data),
  getSubmissionStatus: (id: string) => api.get(`/submissions/${id}/status`),
  getUserSubmissions: (params?: any) => api.get('/submissions/my', { params }),
  getLeaderboard: (params?: any) => api.get('/submissions/leaderboard', { params }),
};

export default api;
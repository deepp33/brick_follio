import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://13.235.0.227:5000/api', // Update this with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const projectsApi = {
  // Get all projects
  getProjects: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.sortBy && params.sortBy !== 'default') queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    return api.get(`/projects${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get single project by ID
  getProject: (id: string) => api.get(`/projects/${id}`),
};

export default api;

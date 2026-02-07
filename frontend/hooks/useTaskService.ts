import { useAuth } from '../context/AuthContext';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

/**
 * Dynamic API Base URL Configuration
 * 
 * In development:
 * - Uses relative /api (proxied by vite to localhost:5000)
 * 
 * In production:
 * - Uses VITE_API_URL environment variable for cross-domain API
 */
const getApiBase = () => {
  // Check for environment variable (set during Vite build)
  const envApiUrl = (import.meta as any)?.env?.VITE_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  // Fall back to relative path (works when frontend & backend served from same domain)
  return '/api';
};

const API_BASE_URL = getApiBase();

export const useTaskService = () => {
  const { token } = useAuth();

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  return {
    getTasks: async (): Promise<Task[]> => {
      const response = await makeRequest('/tasks');
      return response.data || [];
    },

    getTask: async (id: string): Promise<Task | null> => {
      const response = await makeRequest(`/tasks/${id}`);
      return response.data || null;
    },

    createTask: async (data: CreateTaskDTO): Promise<Task> => {
      const response = await makeRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    },

    updateTask: async (id: string, updates: UpdateTaskDTO): Promise<Task> => {
      const response = await makeRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response.data;
    },

    deleteTask: async (id: string): Promise<void> => {
      await makeRequest(`/tasks/${id}`, {
        method: 'DELETE',
      });
    },
  };
};

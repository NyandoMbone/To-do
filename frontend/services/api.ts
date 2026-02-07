import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

/**
 * Dynamic API Base URL Configuration
 * 
 * In production:
 * - Uses window.location.origin/api (relative URLs) - works for same-domain deployment
 * - OR uses VITE_API_URL environment variable for cross-domain API
 * 
 * In development:
 * - Uses /api which proxies to http://localhost:5000 via vite config
 */
const API_BASE = (() => {
  // First check if API URL is set as environment variable (from Vite build)
  const envApiUrl = (window as any).import?.meta?.env?.VITE_API_URL;
  if (envApiUrl) {
    return `${envApiUrl}/api/tasks`;
  }
  
  // Use relative path (works when frontend & backend served from same domain)
  return '/api/tasks';
})();

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const taskService = {
  // GET /api/tasks
  getTasks: async (): Promise<Task[]> => {
    const res = await fetch(API_BASE);
    return handleResponse(res);
  },

  // POST /api/tasks
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // PUT /api/tasks/:id
  updateTask: async (id: string, updates: UpdateTaskDTO): Promise<Task> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // DELETE /api/tasks/:id
  deleteTask: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
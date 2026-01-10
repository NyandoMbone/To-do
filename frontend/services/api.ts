import { Task, TaskStatus, TaskPriority, CreateTaskDTO, UpdateTaskDTO } from '../types';

const STORAGE_KEY = 'task_manager_data';
const SIMULATED_DELAY_MS = 600; // Simulate network latency

// Initial dummy data to populate the app if empty
const INITIAL_DATA: Task[] = [
  {
    id: '1',
    title: 'Review Frontend Architecture',
    description: 'Check the component structure and ensure separation of concerns.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy Groceries',
    description: 'Milk, Eggs, Bread, and Coffee.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Deploy to Production',
    description: 'Run the build pipeline and verify functionality.',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Helper to simulate async delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get from local storage
const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_DATA;
};

// Helper to save to local storage
const saveStoredTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  // GET /tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(SIMULATED_DELAY_MS);
    return getStoredTasks();
  },

  // POST /tasks
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    await delay(SIMULATED_DELAY_MS);
    const tasks = getStoredTasks();
    
    const newTask: Task = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    saveStoredTasks(updatedTasks);
    return newTask;
  },

  // PUT /tasks/:id
  updateTask: async (id: string, updates: UpdateTaskDTO): Promise<Task> => {
    await delay(SIMULATED_DELAY_MS);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    
    if (index === -1) throw new Error('Task not found');

    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    
    saveStoredTasks(tasks);
    return updatedTask;
  },

  // DELETE /tasks/:id
  deleteTask: async (id: string): Promise<void> => {
    await delay(SIMULATED_DELAY_MS);
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter((t) => t.id !== id);
    saveStoredTasks(filteredTasks);
  },
};
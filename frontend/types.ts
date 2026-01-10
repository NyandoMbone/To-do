// Define Enums for strong typing
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// The main Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO Date string
  createdAt: string; // ISO Date string
}

// Type for creating a new task (omits system-generated fields)
export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>;

// Type for updating a task
export type UpdateTaskDTO = Partial<CreateTaskDTO>;

// Filtering and Sorting types
export type SortOption = 'dueDate' | 'createdAt' | 'priority';
export type FilterStatus = TaskStatus | 'all';
export type FilterPriority = TaskPriority | 'all';
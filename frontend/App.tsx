import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { useTaskService } from './hooks/useTaskService';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Task, TaskStatus, TaskPriority, CreateTaskDTO, FilterStatus, FilterPriority, SortOption } from './types';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { Modal } from './components/Modal';
import { FilterToolbar } from './components/FilterToolbar';
import { PlusIcon } from './components/Icons';
import { ProfilePage } from './pages/ProfilePage';
import { TaskDetails } from './pages/TaskDetails';
import { NavBar } from './components/NavBar';

function App() {
  // Auth
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  // Tasks
  const taskService = useTaskService();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  // UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Simple client-side routing using history API
  const [route, setRoute] = useState(window.location.pathname || '/');
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (path: string) => {
    if (path === route) return;
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  // Filters
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  // removed showProfile state; profile is a route now

  // Load tasks when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadTasks();
    }
  }, [isAuthenticated, authLoading]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      alert('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateTaskDTO) => {
    try {
      setOperationLoading(true);
      const newTask = await taskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      closeModal();
    } catch (error) {
      console.error("Failed to create task", error);
      alert('Failed to create task. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdate = async (data: CreateTaskDTO) => {
    if (!editingTask) return;
    try {
      setOperationLoading(true);
      const updatedTask = await taskService.updateTask(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      closeModal();
    } catch (error) {
      console.error("Failed to update task", error);
      alert('Failed to update task. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await taskService.deleteTask(id);
    } catch (error) {
      setTasks(previousTasks);
      console.error("Failed to delete task", error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;

    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));

    try {
      await taskService.updateTask(task.id, { status: newStatus });
    } catch (error) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      console.error("Failed to update status", error);
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // Processing tasks with filters and sorting
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (filterStatus !== 'all') {
      result = result.filter((t) => t.status === filterStatus);
    }
    if (filterPriority !== 'all') {
      result = result.filter((t) => t.priority === filterPriority);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          (t.description && t.description.toLowerCase().includes(lowerQuery))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = {
          [TaskPriority.HIGH]: 3,
          [TaskPriority.MEDIUM]: 2,
          [TaskPriority.LOW]: 1,
        };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

    return result;
  }, [tasks, filterStatus, filterPriority, searchQuery, sortBy]);

  // Show auth pages
  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <LoginPage onSwitch={setAuthPage} />
    ) : (
      <RegisterPage onSwitch={setAuthPage} />
    );
  }

  // Show loading spinner
  if (authLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // Main app
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <NavBar currentPath={route} onNavigate={navigate} onBack={() => window.history.back()} user={user} onLogout={logout} onCreateTask={openCreateModal} />
      {/* Main Content */}
      {route === '/profile' ? (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <ProfilePage onBack={() => navigate('/tasks')} />
        </main>
      ) : route === '/settings' ? (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Settings page */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-sm text-slate-600">Todo: theme, preferences, defaults.</p>
          </div>
        </main>
      ) : route.startsWith('/tasks/') ? (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <TaskDetails id={route.replace('/tasks/', '')} onBack={() => navigate('/tasks')} onEdit={(t: Task) => { setEditingTask(t); setIsModalOpen(true); navigate('/tasks'); }} />
        </main>
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-800">{tasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Pending</p>
            <p className="text-2xl font-bold text-indigo-600">
              {tasks.filter((t) => t.status !== TaskStatus.DONE).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === TaskStatus.DONE).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">High Priority</p>
            <p className="text-2xl font-bold text-red-600">
              {tasks.filter((t) => t.priority === TaskPriority.HIGH).length}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <FilterToolbar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading tasks...</div>
          ) : processedTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {tasks.length === 0 ? 'No tasks yet. Create one to get started!' : 'No tasks match your filters.'}
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {processedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleStatus(task)}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </main>)
      }

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          isLoading={operationLoading}
          onCancel={closeModal}
        />
      </Modal>

      {/* TaskDetails is rendered inside the main content when route startsWith('/tasks/') */}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, CreateTaskDTO } from '../types';
import { PlusIcon } from '../components/Icons';

interface DashboardProps {
  tasks: Task[];
  onCreateTask: (data: CreateTaskDTO) => Promise<void>;
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onCreateTask, isLoading }) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      setSubmitting(true);
      await onCreateTask({
        title: quickTitle,
        description: '',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      });
      setQuickTitle('');
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate KPIs
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === TaskStatus.DONE).length;
  const pendingTasks = tasks.filter((t) => t.status !== TaskStatus.DONE).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === TaskPriority.HIGH).length;

  const dueToday = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return (
      dueDate.toDateString() === today.toDateString() &&
      t.status !== TaskStatus.DONE
    );
  }).length;

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === TaskStatus.DONE) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back! 👋</h2>
        <p className="text-slate-500">Here's your task overview for today</p>
      </div>

      {/* Quick Add */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Add Task</h3>
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!quickTitle.trim() || submitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:bg-blue-300"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Total</p>
          <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
          <p className="text-xs text-slate-400 mt-1">{completionRate}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Pending</p>
          <p className="text-2xl font-bold text-indigo-600">{pendingTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Due Today</p>
          <p className="text-2xl font-bold text-amber-600">{dueToday}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">High Priority</p>
          <p className="text-2xl font-bold text-red-500">{highPriorityTasks}</p>
        </div>
      </div>

      {/* Info Box */}
      {overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <p className="text-sm font-medium text-red-900">
            ⚠️ You have {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''} that need attention!
          </p>
        </div>
      )}

      {completedTasks === totalTasks && totalTasks > 0 && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
          <p className="text-sm font-medium text-green-900">
            ✅ Great job! All tasks are completed. Time to relax or plan new tasks!
          </p>
        </div>
      )}

      {totalTasks === 0 && (
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl text-center">
          <p className="text-slate-500 mb-4">No tasks yet. Create one to get started! 🚀</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

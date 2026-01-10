import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { EditIcon, TrashIcon, CalendarIcon, CheckCircleIcon, CircleIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH: return 'bg-red-100 text-red-700 border-red-200';
    case TaskPriority.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
    case TaskPriority.LOW: return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getStatusColor = (status: TaskStatus) => {
    switch(status) {
        case TaskStatus.DONE: return 'bg-green-100 text-green-700 border-green-200';
        case TaskStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isDone = task.status === TaskStatus.DONE;

  return (
    <div className={`group bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${isDone ? 'border-slate-100 opacity-75' : 'border-slate-200'}`}>
      <div className="flex items-start gap-4">
        
        {/* Toggle Button */}
        <button 
          onClick={() => onToggleStatus(task)}
          className={`mt-1 flex-shrink-0 transition-colors ${isDone ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
        >
          {isDone ? <CheckCircleIcon filled className="w-6 h-6" /> : <CircleIcon className="w-6 h-6" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-lg truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${isDone ? 'text-slate-300' : 'text-slate-500'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-3">
               <span className={`px-2 py-0.5 rounded border ${getStatusColor(task.status)}`}>
                   {task.status.replace('-', ' ')}
               </span>
               {task.dueDate && (
                 <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && !isDone ? 'text-red-500 font-medium' : ''}`}>
                    <CalendarIcon className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
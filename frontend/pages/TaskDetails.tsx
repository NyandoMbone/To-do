import React, { useEffect, useState } from 'react';
import { useTaskService } from '../hooks/useTaskService';
import { Task } from '../types';

export const TaskDetails: React.FC<{ id: string; onBack: () => void; onEdit?: (task: Task) => void }> = ({ id, onBack, onEdit }) => {
  const svc = useTaskService();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const t = await svc.getTask(id);
        if (mounted) setTask(t);
      } catch (err) {
        console.error('Failed to load task', err);
        alert('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!task) return <div className="p-6">Task not found.</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <p className="text-sm text-slate-500">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit && onEdit(task)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
          <button onClick={onBack} className="px-3 py-1 border rounded">Back</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Status</p>
          <p className="font-medium">{task.status}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Priority</p>
          <p className="font-medium">{task.priority}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Due</p>
          <p className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleString() : '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Created</p>
          <p className="font-medium">{new Date(task.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

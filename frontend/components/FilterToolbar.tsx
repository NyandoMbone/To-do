import React from 'react';
import { FilterStatus, FilterPriority, TaskStatus, TaskPriority, SortOption } from '../types';
import { FilterIcon } from './Icons';

interface FilterToolbarProps {
  status: FilterStatus;
  priority: FilterPriority;
  search: string;
  sortBy: SortOption;
  onStatusChange: (status: FilterStatus) => void;
  onPriorityChange: (priority: FilterPriority) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  status,
  priority,
  search,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <div className="flex items-center gap-2 border-r border-slate-200 pr-2">
            <span className="text-slate-400">
                <FilterIcon className="w-4 h-4" />
            </span>
            
            {/* Status Filter */}
            <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
            className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
            >
                <option value="all">All Status</option>
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
            </select>

            {/* Priority Filter */}
            <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as FilterPriority)}
            className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
            >
                <option value="all">All Priorities</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.LOW}>Low</option>
            </select>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100"
        >
          <option value="createdAt">Newest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};
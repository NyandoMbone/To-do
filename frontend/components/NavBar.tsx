import React, { useState, useRef, useEffect } from 'react';

interface NavBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onBack: () => void;
  user?: { id: string; username?: string } | null;
  onLogout?: () => void;
  onCreateTask?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPath, onNavigate, onBack, user, onLogout, onCreateTask }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
          <h1 className="text-lg font-semibold">TaskMaster</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            + New Task
          </button>

          <nav className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-1 rounded ${currentPath === '/' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('/tasks')}
              className={`px-3 py-1 rounded ${currentPath === '/tasks' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              Tasks
            </button>
            <button
              onClick={() => onNavigate('/settings')}
              className={`px-3 py-1 rounded ${currentPath === '/settings' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              Settings
            </button>
            <button onClick={onBack} className="px-3 py-1 rounded hover:bg-slate-50">Back</button>
          </nav>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((s) => !s)}
              className="ml-3 flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50"
            >
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
              <span className="hidden sm:inline text-sm text-slate-700">{user?.username || 'User'}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-md py-1 z-20">
                <button
                  onClick={() => { setOpen(false); onNavigate('/profile'); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => { setOpen(false); onLogout && onLogout(); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

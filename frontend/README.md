# Frontend To-Do App

A modern, responsive React/TypeScript task management application with user authentication and real-time updates.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Component Documentation](#component-documentation)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, read, update, delete tasks
- **Task Filtering**: Filter by status (Todo, In Progress, Done) and priority (Low, Medium, High)
- **Search Functionality**: Search tasks by title or description
- **Sorting Options**: Sort by creation date, due date, or priority
- **Real-time Updates**: Optimistic UI updates with rollback on error
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS for a clean, professional appearance
- **Error Handling**: User-friendly error messages and validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000` (see [Backend Setup](../backend/README.md))

## Installation

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

If you encounter any build errors (especially on Windows with Rollup), try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

Create a `.env.local` file in the frontend directory (optional, as default values are set):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the App

### Development Mode (with hot reload):
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── components/           # Reusable UI components
│   ├── TaskItem.tsx     # Single task display
│   ├── TaskForm.tsx     # Task creation/editing form
│   ├── Modal.tsx        # Modal dialog wrapper
│   ├── FilterToolbar.tsx # Filter and search controls
│   └── Icons.tsx        # SVG icons
├── context/
│   └── AuthContext.tsx  # Authentication state management
├── pages/
│   ├── LoginPage.tsx    # User login page
│   └── RegisterPage.tsx # User registration page
├── hooks/
│   └── useTaskService.ts # Task API service hook
├── services/
│   └── api.ts           # API endpoints
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## Available Scripts

### `npm run dev`
Starts the development server with hot module replacement.

### `npm run build`
Creates an optimized production build in the `dist` folder.

### `npm run preview`
Serves the production build locally for preview.

## Component Documentation

### AuthContext
**Location**: `context/AuthContext.tsx`

Provides authentication state and methods across the app.

```typescript
const { user, token, isAuthenticated, login, register, logout, error } = useAuth();
```

**Methods**:
- `login(username, password)` - Authenticate user
- `register(username, password)` - Create new user account
- `logout()` - Clear auth state
- `clearError()` - Clear error messages

### useTaskService Hook
**Location**: `hooks/useTaskService.ts`

Manages all task-related API calls with automatic token injection.

```typescript
const { getTasks, createTask, updateTask, deleteTask } = useTaskService();
```

### TaskItem Component
**Location**: `components/TaskItem.tsx`

Displays a single task with actions.

**Props**:
- `task: Task` - Task object to display
- `onToggle: () => void` - Status toggle callback
- `onEdit: () => void` - Edit button callback
- `onDelete: () => void` - Delete button callback

### TaskForm Component
**Location**: `components/TaskForm.tsx`

Form for creating/editing tasks.

**Props**:
- `task?: Task` - Task to edit (undefined for create)
- `onSubmit: (data) => Promise<void>` - Form submission handler
- `isLoading: boolean` - Loading state
- `onCancel: () => void` - Cancel button callback

### FilterToolbar Component
**Location**: `components/FilterToolbar.tsx`

Filtering and search controls.

**Props**:
- `filterStatus: FilterStatus` - Current status filter
- `setFilterStatus: (status) => void` - Status filter setter
- `filterPriority: FilterPriority` - Current priority filter
- `setFilterPriority: (priority) => void` - Priority filter setter
- `searchQuery: string` - Current search query
- `setSearchQuery: (query) => void` - Search setter
- `sortBy: SortOption` - Current sort option
- `setSortBy: (option) => void` - Sort setter

## Type Definitions

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO Date string
  createdAt: string; // ISO Date string
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
```

## Authentication Flow

1. User lands on app
2. If not authenticated, shows login/register pages
3. User enters credentials and submits
4. AuthContext makes API call to backend
5. Token stored in localStorage
6. App redirects to task management page
7. All subsequent requests include token in headers
8. If token expires or is invalid, user is logged out

## API Integration

All API calls are made through the `useTaskService` hook, which:
- Automatically includes JWT token in headers
- Handles request/response formatting
- Throws errors for UI handling
- Uses `http://localhost:5000/api` as base URL

Example API call:
```typescript
const taskService = useTaskService();
const tasks = await taskService.getTasks();
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design approach
- **Dark Mode Ready**: Can be extended with dark mode support
- **Custom CSS**: Additional styles in component files as needed

## Error Handling

The app handles errors gracefully with:
- User-friendly error messages
- Console logging for debugging
- Automatic error clearing on navigation
- Retry mechanisms for failed operations

Example:
```typescript
try {
  await taskService.createTask(data);
} catch (error) {
  alert(error.message); // Shows user-friendly error
  console.error(error);   // Logs full error
}
```

## Performance Optimizations

- **Memoization**: `useMemo` for filtered/sorted task lists
- **Optimistic Updates**: UI updates immediately, reverts on error
- **Lazy Loading**: Components load as needed
- **Code Splitting**: Vite automatically handles code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
```
EADDRINUSE: address already in use :::5173
```
Solution:
```bash
npm run dev -- --port 3000
```

### Cannot find module errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Error
- Ensure backend is running on `http://localhost:5000`
- Check firewall/network settings
- Verify CORS is enabled on backend

### Build fails with "Cannot find module '@rollup/rollup-win32-x64-msvc'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Login not working
1. Ensure backend is running (`npm run dev` in backend folder)
2. Check console for error messages
3. Verify MySQL database is set up correctly
4. Check backend `.env` file configuration

### Tasks not loading after login
1. Check browser console for errors
2. Verify backend API is responding: `http://localhost:5000/health`
3. Check that valid token is in localStorage
4. Try logging out and back in

## Development Tips

1. **Debug API Calls**: Use browser DevTools Network tab to inspect API requests
2. **React DevTools**: Install React DevTools browser extension for component inspection
3. **Console Logging**: Use `console.log()` to debug state changes
4. **TypeScript**: Leverage TypeScript for type safety and autocomplete

## Performance Monitoring

To check app performance:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record and interact with app
4. Click Stop to see performance metrics

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component documentation
3. Check backend logs for API errors
4. Open an issue in the repository

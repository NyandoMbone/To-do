# TaskMaster - Complete To-Do Application

A full-stack task management application built with React/TypeScript frontend and Node.js/Express backend with MySQL database.

## 🎯 Overview

This is a complete task management system with:
- ✅ User authentication (register/login/logout)
- ✅ Full CRUD operations for tasks
- ✅ Task filtering, searching, and sorting
- ✅ Responsive modern UI with Tailwind CSS
- ✅ RESTful API with JWT authentication
- ✅ MySQL database with proper schema
- ✅ Error handling and validation
- ✅ Comprehensive documentation

## 📁 Project Structure

```
To-do-list-project-/
├── backend/                 # Node.js/Express API
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── constants.js     # App constants
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── response.js      # Response helpers
│   ├── server.js            # Main server file
│   ├── package.json
│   ├── README.md            # Backend documentation
│   └── .env                 # Environment variables (create this)
│
├── frontend/                # React/TypeScript app
│   ├── components/
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── Modal.tsx
│   │   ├── FilterToolbar.tsx
│   │   └── Icons.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── hooks/
│   │   └── useTaskService.ts # API service hook
│   ├── styles/
│   │   └── auth.css         # Authentication styles
│   ├── services/
│   │   └── api.ts           # API endpoints
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main component
│   ├── index.tsx            # Entry point
│   ├── package.json
│   ├── README.md            # Frontend documentation
│   └── .env.local           # Environment variables (optional)
│
├── .gitignore               # Git ignore rules
└── SETUP.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MySQL Server v5.7+

### Backend Setup (5 minutes)

1. **Create MySQL database**:
```bash
mysql -u root -p
CREATE DATABASE todo_app;
EXIT;
```

2. **Install backend dependencies**:
```bash
cd backend
npm install
```

3. **Create `.env` file**:
```bash
# backend/.env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h
```

4. **Start backend**:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup (5 minutes)

1. **Install frontend dependencies**:
```bash
cd frontend
npm install
```

2. **Start frontend**:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Test the Application

1. **Register**: Create a new account
   - Username: `testuser`
   - Password: `password123`

2. **Login**: Use your credentials

3. **Create Tasks**: Click "New Task" button

4. **Manage Tasks**: Edit, delete, filter, and search tasks

## 📚 API Documentation

All endpoints documented in [backend/README.md](backend/README.md)

### Key Endpoints

```
Authentication:
- POST   /api/auth/register
- POST   /api/auth/login
- GET    /api/auth/me

Tasks:
- GET    /api/tasks
- POST   /api/tasks
- PUT    /api/tasks/:id
- DELETE /api/tasks/:id
```

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include token in Authorization header
5. Backend verifies token before processing requests

Token Format: `Bearer <your_jwt_token>`

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATETIME,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

## 🛠️ Common Tasks

### Clear Everything and Start Fresh
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
```bash
mysql -u root -p
DROP DATABASE todo_app;
CREATE DATABASE todo_app;
EXIT;
```

### Use Different Port
```bash
# Backend (port 3000)
PORT=3000 npm run dev

# Frontend (port 3173)
npm run dev -- --port 3173
```

### Debug API Calls
- Open browser DevTools (F12)
- Go to Network tab
- Check API requests and responses
- Look at Request Headers for Authorization token

## 📝 Frontend Features

### Components
- **AuthContext**: Manages user authentication state
- **LoginPage/RegisterPage**: Authentication screens
- **TaskItem**: Single task display component
- **TaskForm**: Create/edit task form
- **FilterToolbar**: Filter and search controls
- **Modal**: Reusable modal dialog

### Hooks
- **useAuth**: Access authentication state and methods
- **useTaskService**: Make API calls with automatic token injection

### State Management
- Auth state in Context API
- Task state in App component
- Derived state (filtered/sorted tasks) using useMemo

## 🎨 UI/UX

- **Responsive Design**: Works on mobile, tablet, desktop
- **Tailwind CSS**: Utility-first CSS framework
- **Modern Colors**: Gradient backgrounds, smooth transitions
- **Error Messages**: User-friendly feedback
- **Loading States**: Visual feedback during API calls

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Parameterized SQL queries (prevent SQL injection)
- User isolation (users can only access their own tasks)
- CORS configuration
- Environment variables for sensitive data

## 🧪 Testing Endpoints with curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Create Task (replace TOKEN with actual token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My first task","description":"Task description","priority":"high"}'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Performance Tips

1. **Filtering**: Client-side filtering reduces API calls
2. **Sorting**: Sorting happens in browser after fetching
3. **Memoization**: useMemo prevents unnecessary recalculations
4. **Optimistic Updates**: UI updates before API response
5. **Lazy Loading**: Components load on demand

## 🚨 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Error
- Ensure backend is running on port 5000
- Check backend console for error messages
- Verify MySQL is running and configured

### Login fails
- Check username/password
- Verify backend `.env` has correct DB credentials
- Check MySQL database is created

### Port already in use
- Kill process on that port or use different port
- Change PORT in `.env` file

See detailed troubleshooting in:
- [backend/README.md](backend/README.md#troubleshooting)
- [frontend/README.md](frontend/README.md#troubleshooting)

## 📖 Documentation

- **Backend**: See [backend/README.md](backend/README.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)

## 🎓 Learning Resources

### Frontend
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev

### Backend
- Express: https://expressjs.com
- JWT: https://jwt.io
- MySQL: https://www.mysql.com
- bcryptjs: https://www.npmjs.com/package/bcryptjs

## 📝 License

MIT - Free to use for personal and commercial projects

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 💡 Future Enhancements

- [ ] Task categories/tags
- [ ] Task reminders/notifications
- [ ] Dark mode
- [ ] Task sharing with other users
- [ ] File attachments
- [ ] Task templates
- [ ] Analytics/reporting
- [ ] Mobile app (React Native)

## 📧 Support

For issues:
1. Check troubleshooting sections
2. Review API documentation
3. Check browser console and backend logs
4. Create an issue in the repository

---

**Happy task managing! 🎉**

# Backend To-Do App API

A RESTful Node.js/Express API for managing tasks with user authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Register, login, and JWT-based authorization
- **Task Management**: Create, read, update, delete tasks with full CRUD operations
- **Task Properties**: Title, description, status (todo/in-progress/done), priority (low/medium/high), due dates
- **User Isolation**: Each user can only access their own tasks
- **Error Handling**: Comprehensive error responses with meaningful messages
- **Input Validation**: Validates all inputs before database operations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server (v5.7 or higher)

## Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Create MySQL database**:
```bash
mysql -u root -p
CREATE DATABASE todo_app;
EXIT;
```

3. **Create `.env` file** in the backend directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | MySQL hostname | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `1Lambinfor.` |
| `DB_NAME` | Database name | `todo_app` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-change-in-production` |
| `JWT_EXPIRY` | JWT token expiration | `24h` |

## Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` and automatically create tables if they don't exist.

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "1",
    "username": "john_doe"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "1",
      "username": "john_doe"
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User info retrieved",
  "data": {
    "id": "1",
    "username": "john_doe"
  }
}
```

### Tasks

#### Get All Tasks (Authenticated)
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "1",
      "title": "Complete project",
      "description": "Finish the todo app",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-01-20T10:00:00.000Z",
      "createdAt": "2026-01-10T14:30:00.000Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-01-15T18:00:00.000Z"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "2",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "todo",
    "priority": "medium",
    "dueDate": "2026-01-15T18:00:00.000Z",
    "createdAt": "2026-01-10T14:35:00.000Z"
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done",
  "priority": "high"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "2",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "done",
    "priority": "high",
    "dueDate": "2026-01-15T18:00:00.000Z",
    "createdAt": "2026-01-10T14:35:00.000Z"
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Database Schema

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

## Project Structure

```
backend/
├── config/
│   ├── database.js       # Database connection setup
│   └── constants.js      # App constants and enums
├── controllers/
│   ├── authController.js # Authentication handlers
│   └── taskController.js # Task CRUD handlers
├── middleware/
│   └── authMiddleware.js # JWT verification
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   └── taskRoutes.js     # Task endpoints
├── utils/
│   └── response.js       # Response formatting helpers
├── server.js             # Main server file
├── package.json          # Dependencies
└── .env                  # Environment variables
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL server is running
- Check database credentials in `.env` file
- Verify database exists: `CREATE DATABASE todo_app;`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution:
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
# Or use a different port
PORT=3000 npm run dev
```

### JWT Token Expired
Response:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```
Solution: User needs to login again to get a new token

### Username Already Exists
Response:
```json
{
  "success": false,
  "message": "Username already exists"
}
```
Solution: Choose a different username

## Development Notes

- All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT token in the `Authorization` header
- Token format: `Bearer <token>`
- Passwords are hashed using bcryptjs before storage
- All user data is isolated - users can only access their own tasks
- Timestamps are stored in UTC format

## Security Best Practices

1. **Change JWT_SECRET**: Update `JWT_SECRET` in production environment
2. **HTTPS**: Use HTTPS in production instead of HTTP
3. **Rate Limiting**: Consider adding rate limiting for auth endpoints
4. **CORS**: Configure CORS properly for your domain
5. **Input Validation**: All inputs are validated server-side
6. **SQL Injection**: Using parameterized queries prevents SQL injection

## License

MIT

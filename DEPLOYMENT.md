# Cloud Deployment Guide: GitHub + Render

This guide explains how to deploy your Todo App to **Render** (a cloud Docker platform) without requiring Docker Desktop locally.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Why Render?](#why-render)
3. [Prerequisites](#prerequisites)
4. [Deployment Steps](#deployment-steps)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [Academic Submission Checklist](#academic-submission-checklist)

---

## 🏗️ Architecture Overview

### Cloud Deployment Architecture
```
┌─────────────────────────────────────────────────────┐
│                   RENDER DEPLOYMENT                 │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────┐    ┌──────────────────┐        │
│  │  Frontend App   │    │  Backend API     │        │
│  │  (React+Nginx)  │───→│  (Node.js)       │        │
│  │  https://*.com  │    │  https://*.com   │        │
│  └─────────────────┘    └────────┬─────────┘        │
│                                  │                  │
│                          ┌────────▼─────────┐       │
│                          │  MySQL Database  │       │
│                          │  (Render MySQL)  │       │
│                          └──────────────────┘       │
│                                                       │
└─────────────────────────────────────────────────────┘
             ▲
             │ Push code to GitHub
             │
   ┌─────────┴────────┐
   │  GitHub Repo    │
   │  (Your code)    │
   └─────────────────┘
```

### Key Changes from Local Docker

| Aspect | Local Docker | Render Cloud |
|--------|-------------|--------------|
| Database | `db` (service name) | `DATABASE_URL` (Render's MySQL) |
| Backend Host | `http://localhost:5000` | `https://your-backend.onrender.com` |
| Frontend Host | `http://localhost` | `https://your-frontend.onrender.com` |
| API Config | Nginx proxy `/api` to `backend:5000` | Frontend uses `VITE_API_URL` env var |
| Deployment | `docker-compose up` | Push to GitHub, Render auto-deploys |

---

## ✅ Why Render?

1. **No Docker Desktop required** - Render runs Docker on their servers
2. **Free tier available** - Perfect for academic projects
3. **Auto-deployment** - Push to GitHub, automatic rebuild
4. **MySQL support** - Built-in MySQL database service
5. **Environment variables** - Easy config management
6. **HTTPS included** - Free SSL certificates

---

## 📦 Prerequisites

- ✅ GitHub account (free)
- ✅ Render account (free: https://render.com)
- ✅ Your code repository on GitHub
- ✅ Node.js installed locally (for development only)
- ❌ **NO Docker Desktop required!**

---

## 🚀 Deployment Steps

### Step 1: Prepare Your GitHub Repository

**1.1 Create .env.example files** (Already done in this project)
```bash
# These files document what environment variables are needed
backend/.env.example
frontend/.env.example
```

**1.2 Create render.yaml** (Already done in this project)
```bash
# This file defines your entire cloud deployment
render.yaml
```

**1.3 Push to GitHub**
```bash
git add .
git commit -m "Prepare for Render cloud deployment"
git push origin main
```

### Step 2: Deploy MySQL Database on Render

**2.1 Go to Render Dashboard**
- Visit https://dashboard.render.com
- Sign in or create free account

**2.2 Create MySQL Database**
- Click "New" → "Database" → "MySQL"
- Name: `todo-mysql`
- Select region closest to you
- Select "Free" plan
- Click "Create Database"
- **SAVE** the connection details (connection string format shown)

**2.3 Note Your Connection Details**
Render will provide a connection string like:
```
mysql://username:password@host:port/database
```
This will be automatically passed to your backend as `DATABASE_URL`.

### Step 3: Deploy Backend Service on Render

**3.1 Create Web Service**
- Click "New" → "Web Service"
- Connect your GitHub repository
- Click "Connect" next to your repo

**3.2 Configure Backend Service**
- **Name:** `todo-backend`
- **Runtime:** Node
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Plan:** Free

**3.3 Set Environment Variables**
In the "Environment Variables" section, add:

| Key | Value | Scope |
|-----|-------|-------|
| `NODE_ENV` | `production` | Run |
| `JWT_SECRET` | *(Generate a random string)* | Run |
| `FRONTEND_URL` | `https://todo-frontend.onrender.com` | Run |
| `DATABASE_URL` | *(From MySQL service)* | Run |

**Note:** `DATABASE_URL` is auto-linked from your MySQL service if you select it from the dropdown.

**3.4 Deploy**
- Click "Create Web Service"
- Wait for status to change to "Live" (5-10 minutes)
- Copy the deployed URL (e.g., `https://todo-backend.onrender.com`)

### Step 4: Deploy Frontend Service on Render

**4.1 Create Web Service (for Frontend)**
- Click "New" → "Web Service"
- Connect your GitHub repository again
- Click "Connect" next to your repo

**4.2 Configure Frontend Service**
- **Name:** `todo-frontend`
- **Runtime:** Docker
- **Build Command:** `npm run build` (Render auto-runs in frontend directory)
- **Start Command:** *Leave empty* (Render handles nginx automatically)
- **Plan:** Free

**4.3 Set Environment Variables**
| Key | Value | Scope |
|-----|-------|-------|
| `VITE_API_URL` | `https://todo-backend.onrender.com` | Build |

**IMPORTANT:** Set scope to "Build" so the API URL is baked in during Vite build.

**4.4 Deploy**
- Click "Create Web Service"
- Wait for status to change to "Live" (5-10 minutes)
- Your frontend will be at `https://todo-frontend.onrender.com`

---

## 🔧 Environment Variables

### Backend (.env / Render Dashboard)

```bash
# Production
NODE_ENV=production
JWT_SECRET=your_secure_random_string_here

# Database (auto-provided by Render MySQL service)
DATABASE_URL=mysql://user:pass@host:3306/todo_app
# OR for local development:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=todo_app

# CORS
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (.env.local / Render Build Variables)

```bash
# When building for production (on Render)
VITE_API_URL=https://your-backend.onrender.com

# When running locally with npm run dev
# Leave VITE_API_URL empty (Vite proxy handles it)
```

---

## 🧪 Testing Your Deployment

### Step 1: Test Backend Health Check
```
GET https://your-backend.onrender.com/health

Expected response:
{
  "status": "OK",
  "message": "Todo App Backend is running",
  "environment": "production",
  "database": "Render MySQL"
}
```

### Step 2: Test Frontend
- Visit `https://your-frontend.onrender.com`
- Try to register a new account
- Try to create a task
- Verify API calls succeed ✅

### Step 3: Check Logs
- Backend logs: Render Dashboard → todo-backend → Logs
- Frontend logs: Render Dashboard → todo-frontend → Logs

---

## 🐛 Troubleshooting

### Problem: Backend won't start - "Database connection failed"

**Solution:**
1. Check `DATABASE_URL` is set in Render backend env vars
2. Wait for MySQL service to finish initializing (5+ minutes)
3. Restart backend service: Render Dashboard → todo-backend → "Restart"

### Problem: Frontend can't reach backend - "API error 500"

**Solution:**
1. Check `VITE_API_URL` is set correctly ✅
2. Ensure `FRONTEND_URL` is set in backend ✅
3. Check CORS is enabled in backend/server.js ✅
4. Verify both services are "Live" status ✅

### Problem: Login/Register fails with CORS error

**Solution:**
1. In backend `server.js`, check `FRONTEND_URL` is in `allowedOrigins`
2. Verify `FRONTEND_URL` env var is set in Render backend service
3. Frontend must access backend via `VITE_API_URL` (not localhost)

### Problem: Render shows "out of memory" or crashes

**Solution:**
1. You may need to upgrade from Free tier
2. Check backend logs for memory leaks
3. Consider upgrading to Basic tier ($7/month)

### Problem: Changes not reflecting after git push

**Solution:**
1. Render Dashboard → Service → "Manual Deploy" → "Clear Build Cache" → "Deploy"
2. Wait 5-10 minutes for fresh build
3. Check "Events" tab to see build status

---

## 📋 Academic Submission Checklist

Use this checklist to ensure your project is submission-ready:

### ✅ Deploy Backend
- [ ] Created Render account
- [ ] Created MySQL database on Render
  - [ ] Noted the `DATABASE_URL`
- [ ] Deployed backend service
  - [ ] Service is "Live"
  - [ ] Health check endpoint responds
  - [ ] `JWT_SECRET` is set to random value
  - [ ] `FRONTEND_URL` points to frontend service
  - [ ] `DATABASE_URL` is linked from MySQL service
- [ ] Backend logs show successful DB connection

### ✅ Deploy Database
- [ ] MySQL service is "Live"
- [ ] Tables created successfully (check backend logs)
- [ ] Can verify with: `mysql://...` connection string

### ✅ Deploy Frontend
- [ ] Frontend service deployed
  - [ ] Service is "Live"
  - [ ] `VITE_API_URL` set to backend Render URL
  - [ ] Build completed successfully
- [ ] Can access frontend at `https://your-frontend.onrender.com`

### ✅ Integration Testing
- [ ] Frontend loads without errors
- [ ] Health check endpoint works: `/health`
- [ ] Can create account (register)
- [ ] Can login
- [ ] Can create tasks
- [ ] Can update tasks
- [ ] Can delete tasks
- [ ] Can logout

### ✅ Code & Documentation
- [ ] `.env.example` files document all required variables
- [ ] `render.yaml` configured for automated deployment
- [ ] `.gitignore` excludes `.env` files
- [ ] `DEPLOYMENT.md` (this file) explains workflow
- [ ] Backend `server.js` has production CORS setup
- [ ] Frontend uses dynamic API URL from environment
- [ ] All hardcoded `localhost` references removed

### ✅ Git & Submission
- [ ] All code pushed to GitHub
  - [ ] Including `render.yaml`
  - [ ] Including `.env.example` files
  - [ ] Excluding `.env` files (check .gitignore)
- [ ] GitHub repo is accessible (public or instructor has access)
- [ ] Submit these links to instructor:
  - [ ] GitHub repository URL
  - [ ] Deployed frontend URL (Render)
  - [ ] Deployed backend URL (Render)

### ✅ Production Quality
- [ ] No console errors in frontend
- [ ] No console errors in backend logs
- [ ] Request/response headers look correct
- [ ] Database operations succeed
- [ ] Error handling works (try invalid login)
- [ ] Environment variables are not logged/exposed

---

## 📚 Additional Resources

### Render Documentation
- Render Docs: https://render.com/docs
- MySQL on Render: https://render.com/docs/databases
- Auto-Deploy from GitHub: https://render.com/docs/github

### Best Practices
- Keep `JWT_SECRET` secure (different from local dev)
- Use strong passwords for database
- Monitor usage on free tier (sleep after 15 min inactivity)
- Upgrade to paid tier for production-grade reliability

### Next Steps for Production
1. Use custom domain (instead of .onrender.com)
2. Upgrade from Free to Basic tier ($7/month)
3. Set up error logging (Sentry, LogRocket)
4. Configure auto-scaling
5. Add database backups

---

## 📞 Questions?

If Render services fail to deploy:
1. Check Render status page: https://status.render.com
2. Review server logs in Render dashboard
3. Verify GitHub repository is connected
4. Try "Manual Deploy" with "Clear Build Cache"

**Good luck with your submission!** 🎓

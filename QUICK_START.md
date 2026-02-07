# 🚀 Quick Start: Deploy to Render

No Docker Desktop required! Follow these steps to deploy your app.

---

## 📋 Step 1: Push Code to GitHub

```bash
# Make sure all new files are added
git add .
git commit -m "Add Render cloud deployment configuration"
git push origin main
```

Verify these files are in your GitHub repo:
- ✅ `render.yaml` (root directory)
- ✅ `DEPLOYMENT.md` (root directory)
- ✅ `backend/.env.example`
- ✅ `frontend/.env.example`
- ❌ `.env` files (should NOT be in repo)

---

## 🌐 Step 2: Create Free Render Account

1. Go to https://render.com
2. Sign up (free account)
3. Verify email

---

## 🗄️ Step 3: Deploy MySQL Database

1. Render Dashboard → "New" → "Database" → "MySQL"
2. Name: `todo-mysql`
3. Plan: **Free**
4. Create Database
5. **Copy the connection string** (you'll need it later)

---

## ⚙️ Step 4: Deploy Backend

1. Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name:** `todo-backend`
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

4. **Environment Variables** → Add these:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | *(generate random secret)* |
   | `FRONTEND_URL` | `https://todo-frontend.onrender.com` |
   | `DATABASE_URL` | *(select MySQL service from dropdown)* |

5. "Create Web Service"
6. Wait for "Live" status (5-10 minutes)
7. **Copy the URL** (e.g., `https://todo-backend.onrender.com`)

---

## 🎨 Step 5: Deploy Frontend

1. Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repo again
3. Configure:
   - **Name:** `todo-frontend`
   - **Runtime:** Docker
   - **Build Command:** `npm run build`
   - **Plan:** Free

4. **Environment Variables** → Add:
   | Key | Value | Scope |
   |-----|-------|-------|
   | `VITE_API_URL` | `https://todo-backend.onrender.com` | **Build** |

   ⚠️ **IMPORTANT:** Scope must be "Build"

5. "Create Web Service"
6. Wait for "Live" status (5-10 minutes)
7. **Copy the URL** (e.g., `https://todo-frontend.onrender.com`)

---

## ✅ Step 6: Test Your App

1. Open frontend URL in browser
2. Try to register a new account
3. Try to create a task
4. Try to login/logout

If it works: **Congratulations!** 🎉

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check DATABASE_URL in backend env vars. Restart backend service. |
| API 500 errors | Check VITE_API_URL is correct in frontend env vars. Check backend logs. |
| CORS error | Check FRONTEND_URL is set in backend env vars. Check it's `https://`, not `http://`. |
| Changes not appearing | Dashboard → Service → "Manual Deploy" → "Clear Build Cache" → "Deploy" |

---

## 📝 For Your Instructor

Submit these links:
- **GitHub Repo:** `https://github.com/your-username/repo-name`
- **Frontend:** `https://todo-frontend.onrender.com`
- **Backend:** `https://todo-backend.onrender.com`

All code is in GitHub. Deployment instructions are in `DEPLOYMENT.md`.

---

## 💡 Did You Know?

- ✅ No Docker Desktop needed!
- ✅ Automatically deploys when you push to GitHub
- ✅ Free tier perfect for academic projects
- ✅ HTTPS included automatically
- ✅ MySQL database handles schema creation
- ✅ Can monitor logs in Render dashboard

---

**Need more details?** See [DEPLOYMENT.md](DEPLOYMENT.md)

**Question about changes?** See [CLOUD_DEPLOYMENT_CHANGES.md](CLOUD_DEPLOYMENT_CHANGES.md)

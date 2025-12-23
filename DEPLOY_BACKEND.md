# 🚀 Backend Deployment Guide

## ✅ Frontend Deployed Successfully!
**URL:** https://frontend-capyngenindia.vercel.app

---

## 📦 Step 1: Setup MongoDB Atlas (5 minutes)

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Sign up/Login** with your account
3. **Create a FREE cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select region closest to you (e.g., AWS Mumbai)
   - Click "Create"

4. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `lookstrendz`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist IP Address:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://lookstrendz:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://lookstrendz:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority`

---

## 🚂 Step 2: Deploy Backend to Railway (3 minutes)

### Option A: Deploy via Railway Dashboard (Recommended)

1. **Go to Railway:** https://railway.app/
2. **Sign up/Login** with GitHub
3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `SurajTrs/Looks-Trendz`
   - Select the `backend` folder as root directory

4. **Configure Environment Variables:**
   Click "Variables" tab and add:
   ```
   DATABASE_URL=mongodb+srv://lookstrendz:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-production-change-this-to-random-string
   PORT=5001
   NODE_ENV=production
   FRONTEND_URL=https://frontend-lookstrendz.vercel.app
   ```

5. **Deploy:**
   - Railway will auto-deploy
   - Wait 2-3 minutes for build to complete
   - Copy your backend URL (e.g., `https://looks-trendz-backend.up.railway.app`)

### Option B: Deploy via Railway CLI

```bash
# Login to Railway
railway login

# Link to project
cd backend
railway link

# Set environment variables
railway variables set DATABASE_URL="mongodb+srv://lookstrendz:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority"
railway variables set JWT_SECRET="your-super-secret-jwt-key-production"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="https://frontend-capyngenindia.vercel.app"

# Deploy
railway up
```

---

## 🔗 Step 3: Connect Frontend to Backend (1 minute)

1. **Update Frontend Environment Variable in Vercel:**
   - Go to: https://vercel.com/capyngenindia/frontend/settings/environment-variables
   - Add new variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://YOUR-RAILWAY-URL.up.railway.app/api`
   - Click "Save"
   - Redeploy frontend: `vercel --prod` or trigger redeploy in Vercel dashboard

---

## 🌱 Step 4: Seed Database (1 minute)

After backend is deployed, seed the database:

```bash
# Option 1: Via Railway CLI
railway run npm run db:seed

# Option 2: Via API call
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/seed
```

---

## ✅ Step 5: Test Your Live Application

1. **Visit:** https://frontend-capyngenindia.vercel.app
2. **Login with admin credentials:**
   - Email: `admin@lookstrendz.com`
   - Password: `Admin@123`
3. **Test booking flow**
4. **Access admin dashboard:** https://frontend-capyngenindia.vercel.app/admin/dashboard

---

## 🎉 Your Application is LIVE!

**Frontend:** https://frontend-capyngenindia.vercel.app
**Backend:** https://YOUR-RAILWAY-URL.up.railway.app
**Admin Panel:** https://frontend-capyngenindia.vercel.app/admin/dashboard

---

## 🔧 Troubleshooting

### Backend not starting?
- Check Railway logs: `railway logs`
- Verify DATABASE_URL is correct
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend can't connect to backend?
- Verify NEXT_PUBLIC_API_URL in Vercel
- Check CORS settings in backend (FRONTEND_URL)
- Redeploy frontend after changing env vars

### Database connection error?
- Verify MongoDB Atlas user password
- Check network access settings
- Ensure connection string includes database name

---

## 📞 Need Help?

Check Railway logs: `railway logs`
Check Vercel logs: https://vercel.com/capyngenindia/frontend/deployments

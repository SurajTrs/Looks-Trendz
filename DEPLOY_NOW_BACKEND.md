# 🚀 DEPLOY BACKEND NOW - Quick Guide

## Your MongoDB Atlas Details:
- **Connection String:** `mongodb+srv://Suraj:<db_password>@cluster0.fgwml28.mongodb.net/`
- **Database Name:** `looks_trendz_salon`

---

## 🚂 Deploy to Railway (3 minutes)

### Step 1: Go to Railway
Visit: https://railway.app/new

### Step 2: Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select: `SurajTrs/Looks-Trendz`
3. Click "Deploy Now"

### Step 3: Configure Root Directory
1. Go to "Settings" tab
2. Find "Root Directory"
3. Set to: `backend`
4. Click "Save"

### Step 4: Add Environment Variables
Click "Variables" tab and add these:

```
DATABASE_URL=mongodb+srv://Suraj:YOUR_PASSWORD@cluster0.fgwml28.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority
JWT_SECRET=looks-trendz-production-secret-key-2024
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://frontend-lookstrendz.vercel.app
```

**IMPORTANT:** Replace `YOUR_PASSWORD` with your actual MongoDB password!

### Step 5: Deploy
- Railway will auto-deploy
- Wait 2-3 minutes
- Copy your backend URL (e.g., `https://looks-trendz-backend.up.railway.app`)

---

## 🔗 Connect Frontend to Backend

### Update Vercel Environment Variable:
1. Go to: https://vercel.com/capyngenindia/frontend/settings/environment-variables
2. Add or update:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://YOUR-RAILWAY-URL.up.railway.app/api`
   - **Environment:** Production
3. Click "Save"
4. Go to "Deployments" tab
5. Click "Redeploy" on latest deployment

---

## 🌱 Seed Database

After backend is deployed, seed the database with initial data:

### Option 1: Via Railway Dashboard
1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Deploy"
4. Run command: `npm run db:seed`

### Option 2: Via API Call
```bash
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/seed
```

This will create:
- Admin user: admin@lookstrendz.com / Admin@123
- 4 Staff members
- 121 Services across all categories
- Sample bookings

---

## ✅ Test Your Application

1. Visit: https://frontend-lookstrendz.vercel.app
2. Click "Login"
3. Use admin credentials:
   - Email: `admin@lookstrendz.com`
   - Password: `Admin@123`
4. Test booking a service
5. Access admin dashboard: https://frontend-lookstrendz.vercel.app/admin/dashboard

---

## 🎉 You're Done!

**Frontend:** https://frontend-lookstrendz.vercel.app
**Backend:** https://YOUR-RAILWAY-URL.up.railway.app
**Admin Panel:** https://frontend-lookstrendz.vercel.app/admin/dashboard

---

## 🔧 Troubleshooting

### Can't connect to MongoDB?
- Verify your password is correct (no special characters that need encoding)
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Ensure database user has read/write permissions

### Backend deployment failed?
- Check Railway logs
- Verify all environment variables are set
- Ensure root directory is set to `backend`

### Frontend can't reach backend?
- Verify NEXT_PUBLIC_API_URL in Vercel
- Must include `/api` at the end
- Redeploy frontend after changing env vars

---

## 📞 Railway CLI Alternative

If you prefer CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd backend
railway link

# Set variables
railway variables set DATABASE_URL="mongodb+srv://Suraj:YOUR_PASSWORD@cluster0.fgwml28.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority"
railway variables set JWT_SECRET="looks-trendz-production-secret-key-2024"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="https://frontend-lookstrendz.vercel.app"

# Deploy
railway up

# Seed database
railway run npm run db:seed
```

---

**Total Time: ~5 minutes**
**Let's make your salon management system LIVE! 🚀**

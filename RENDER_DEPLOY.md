# 🚀 Deploy Backend to Render - 5 Minutes

## Step 1: Go to Render
Visit: https://dashboard.render.com/

## Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account if not connected
3. Select repository: `SurajTrs/Looks-Trendz`

## Step 3: Configure Service
Fill in these details:

**Name:** `looks-trendz-backend`

**Region:** Singapore (or closest to you)

**Branch:** `main`

**Root Directory:** `backend`

**Runtime:** Node

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
node dist/server.js
```

**Instance Type:** Free

## Step 4: Add Environment Variables
Click "Advanced" and add these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mongodb+srv://Suraj:YOUR_PASSWORD@cluster0.fgwml28.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority` |
| `JWT_SECRET` | `looks-trendz-production-secret-2024` |
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `FRONTEND_URL` | `https://frontend-lookstrendz.vercel.app` |

**IMPORTANT:** Replace `YOUR_PASSWORD` with your actual MongoDB password!

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Your backend URL will be: `https://looks-trendz-backend.onrender.com`

## Step 6: Update Frontend
1. Go to Vercel: https://vercel.com/capyngenindia/frontend/settings/environment-variables
2. Add or update:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://looks-trendz-backend.onrender.com/api`
   - **Environment:** Production
3. Click "Save"
4. Go to "Deployments" → Click "Redeploy" on latest

## Step 7: Seed Database
After backend is deployed, seed the database:

**Option 1: Via Render Shell**
1. Go to your service in Render
2. Click "Shell" tab
3. Run: `npm run db:seed`

**Option 2: Via API Call**
```bash
curl -X POST https://looks-trendz-backend.onrender.com/api/seed
```

## ✅ Test Your Application
1. Visit: https://frontend-lookstrendz.vercel.app
2. Click "Login"
3. Use credentials:
   - Email: `admin@lookstrendz.com`
   - Password: `Admin@123`
4. Test booking and admin dashboard

---

## 🎉 Your URLs

**Frontend:** https://frontend-lookstrendz.vercel.app
**Backend:** https://looks-trendz-backend.onrender.com
**Admin Panel:** https://frontend-lookstrendz.vercel.app/admin/dashboard

---

## 📝 Notes

- Render free tier may sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- For production, consider upgrading to paid tier ($7/month)

---

## 🔧 Troubleshooting

**Build Failed?**
- Check build logs in Render dashboard
- Verify all dependencies in package.json
- Ensure TypeScript compiles without errors

**Can't Connect to MongoDB?**
- Verify MongoDB Atlas password is correct
- Check MongoDB Network Access allows 0.0.0.0/0
- Ensure connection string includes database name

**Frontend Can't Reach Backend?**
- Verify NEXT_PUBLIC_API_URL in Vercel
- Must include `/api` at the end
- Redeploy frontend after changing env vars
- Check CORS settings (FRONTEND_URL in backend)

---

**Total Time: ~5 minutes**
**Let's make your salon app LIVE! 🚀**

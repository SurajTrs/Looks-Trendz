# Backend Deployment to Railway - Step by Step

## ✅ Frontend Deployed Successfully!
**URL:** https://frontend-capyngenindia.vercel.app

---

## 🚂 Deploy Backend to Railway

### Step 1: Login to Railway
1. Open your browser and go to: https://railway.app/
2. Sign in with GitHub (use the same account: SurajTrs)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: **SurajTrs/Looks-Trendz**
4. Railway will detect the repository

### Step 3: Configure Backend Service
1. Click **"Add variables"** or go to **Variables** tab
2. Add the following environment variables:

```
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-production-change-this
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://frontend-capyngenindia.vercel.app
```

### Step 4: Set Root Directory
1. Go to **Settings** tab
2. Find **"Root Directory"** setting
3. Set it to: `backend`
4. Click **Save**

### Step 5: Set Build & Start Commands
1. In **Settings** tab, find **"Build Command"**
2. Set Build Command: `npm install && npx prisma generate && npm run build`
3. Set Start Command: `npm start`
4. Click **Save**

### Step 6: Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, you'll see a URL like: `https://looks-trendz-salon-production.up.railway.app`

### Step 7: Get Your Backend URL
1. Go to **Settings** tab
2. Find **"Domains"** section
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `https://looks-trendz-salon-production.up.railway.app`)

---

## 📊 Setup MongoDB Atlas (Required)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account

### Step 2: Create Cluster
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select region closest to you
4. Click **"Create Cluster"**

### Step 3: Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `lookstrendz`
5. Password: Generate a strong password (save it!)
6. Set privileges to: **Read and write to any database**
7. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `looks_trendz_salon`

Example:
```
mongodb+srv://lookstrendz:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority
```

### Step 6: Update Railway Environment Variables
1. Go back to Railway dashboard
2. Go to **Variables** tab
3. Update `DATABASE_URL` with your MongoDB Atlas connection string
4. Click **Save**
5. Railway will automatically redeploy

---

## 🌱 Seed the Database

### Option 1: Using Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run seed command
railway run npm run seed
```

### Option 2: Using API Endpoint
Once backend is deployed, visit:
```
https://your-backend-url.railway.app/api/seed
```

This will seed the database with:
- 4 Staff members
- 121 Services across all categories
- Admin user (admin@lookstrendz.com / Admin@123)

---

## 🔗 Update Frontend Environment Variable

### Step 1: Update Vercel Environment Variable
1. Go to: https://vercel.com/capyngenindia/frontend
2. Go to **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_API_URL`
4. Update value to: `https://your-backend-url.railway.app/api`
5. Click **Save**

### Step 2: Redeploy Frontend
```bash
cd /Users/surajrawat/Desktop/looks-trendz-salon/frontend
vercel --prod
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Railway project created from GitHub
- [ ] Environment variables set in Railway
- [ ] Root directory set to `backend`
- [ ] Backend deployed successfully
- [ ] Database seeded with initial data
- [ ] Frontend environment variable updated
- [ ] Frontend redeployed with new API URL

---

## 🎉 Your Application URLs

**Frontend:** https://frontend-capyngenindia.vercel.app
**Backend:** https://your-backend-url.railway.app (after deployment)

**Admin Login:**
- Email: admin@lookstrendz.com
- Password: Admin@123

---

## 🐛 Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend can't connect to backend
- Verify NEXT_PUBLIC_API_URL in Vercel
- Check CORS settings in backend
- Ensure FRONTEND_URL is set correctly in Railway

### Database connection failed
- Verify MongoDB Atlas connection string
- Check database user credentials
- Ensure network access is configured

---

## 📞 Need Help?

If you encounter any issues:
1. Check Railway deployment logs
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas is accessible

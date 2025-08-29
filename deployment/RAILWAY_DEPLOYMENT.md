# Railway Backend Deployment Guide

## 🚂 Deploy to Railway

### 1. Prepare Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Metalogics AI Assistant"

# Push to GitHub
git remote add origin https://github.com/M-B-Kiyani/metalogics-ai-assistant.git
git push -u origin main
```

### 2. Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose "Deploy from the repo root"

### 3. Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@metalogics.io
JWT_SECRET=your_secure_jwt_secret_here
```

### 4. Database Setup
Railway will automatically provision PostgreSQL:
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway will auto-generate `DATABASE_URL`
3. No manual configuration needed

### 5. Custom Start Command
In Railway Settings → Deploy:
- **Root Directory**: `/server`
- **Start Command**: `npm start`
- **Healthcheck Path**: `/api/health`

### 6. Domain Setup
1. Railway provides a default domain: `your-app.railway.app`
2. For custom domain: Settings → Networking → Custom Domain
3. Copy the Railway URL for frontend configuration

## ✅ Deployment Checklist
- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] PostgreSQL database connected
- [ ] Health check passing at `/api/health`
- [ ] Domain URL copied for frontend

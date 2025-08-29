# Vercel Frontend Deployment Guide

## ⚡ Deploy to Vercel

### 1. Prepare Frontend for Production
Update the API URL in your environment:

```bash
# In client/.env.production
REACT_APP_API_URL=https://your-railway-app.railway.app/api
```

### 2. Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-railway-backend.railway.app/api
```

### 4. Build Settings
Vercel will auto-detect React and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 5. Domain Configuration
1. Vercel provides: `your-app.vercel.app`
2. For custom domain: Settings → Domains
3. Copy the Vercel URL for widget integration

## 🔧 Production Optimizations

### Update CORS in Backend
Add your Vercel domain to CORS origins in `server/src/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://metalogics.io', 
        'https://www.metalogics.io',
        'https://your-app.vercel.app'  // Add your Vercel domain
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
```

### Widget Script Update
Update the widget script with your production URLs:

```javascript
// In client/src/widget.js
const WIDGET_CONFIG = {
  apiUrl: 'https://your-railway-backend.railway.app/api',
  // ... rest of config
};
```

## ✅ Deployment Checklist
- [ ] Railway backend URL obtained
- [ ] Frontend environment variables set
- [ ] Vercel project created and deployed
- [ ] CORS updated with Vercel domain
- [ ] Widget script configured with production URLs
- [ ] Frontend accessible at Vercel URL

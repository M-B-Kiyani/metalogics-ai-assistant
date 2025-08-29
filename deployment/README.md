# Deployment Guide

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your API keys in .env
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup Knowledge Base**
   ```bash
   node scripts/setup.js
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## Production Deployment

### Option 1: Railway (Recommended)

1. **Backend Deployment**
   - Connect GitHub repo to Railway
   - Deploy from `/server` directory
   - Add environment variables
   - Railway will auto-provision PostgreSQL

2. **Frontend Deployment**
   - Deploy `/client` to Vercel/Netlify
   - Set `REACT_APP_API_URL` to Railway backend URL

### Option 2: Docker

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

### Option 3: Manual Deployment

1. **Database Setup**
   ```sql
   CREATE DATABASE metalogics_chatbot;
   ```

2. **Backend (Node.js)**
   ```bash
   cd server
   npm install --production
   npm start
   ```

3. **Frontend (React)**
   ```bash
   cd client
   npm install
   npm run build
   # Serve build/ directory
   ```

## Environment Variables

### Required
- `OPENAI_API_KEY`: OpenAI API key
- `DATABASE_URL`: PostgreSQL connection string

### Optional
- `SENDGRID_API_KEY`: Email notifications
- `JWT_SECRET`: Session security
- `NODE_ENV`: Environment (development/production)

## Integration with metalogics.io

Add this script tag to your website:

```html
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-frontend-url.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

## Monitoring

- Health check: `GET /api/health`
- Logs: Check server console/Railway logs
- Database: Monitor PostgreSQL performance
- Rate limiting: 100 requests/minute per IP

## Security

- CORS configured for metalogics.io
- Rate limiting enabled
- Input validation on all endpoints
- SQL injection protection via Sequelize
- XSS protection via helmet

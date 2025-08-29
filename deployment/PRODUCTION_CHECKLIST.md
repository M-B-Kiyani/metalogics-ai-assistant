# Production Deployment Checklist

## 🚀 Step-by-Step Deployment

### Phase 1: Backend Deployment (Railway)

1. **Repository Setup**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Metalogics AI Assistant"
   git remote add origin https://github.com/yourusername/metalogics-ai-assistant.git
   git push -u origin main
   ```

2. **Railway Deployment**
   - [ ] Create Railway account at [railway.app](https://railway.app)
   - [ ] Connect GitHub repository
   - [ ] Set root directory to `/server`
   - [ ] Add PostgreSQL database service
   - [ ] Configure environment variables:
     ```env
     NODE_ENV=production
     OPENAI_API_KEY=sk-...
     SENDGRID_API_KEY=SG...
     FROM_EMAIL=noreply@metalogics.io
     JWT_SECRET=your-secure-secret
     ```
   - [ ] Deploy and verify health check: `https://your-app.railway.app/api/health`
   - [ ] Copy Railway URL for frontend configuration

### Phase 2: Frontend Deployment (Vercel)

3. **Vercel Deployment**
   - [ ] Create Vercel account at [vercel.com](https://vercel.com)
   - [ ] Import GitHub repository
   - [ ] Set root directory to `/client`
   - [ ] Add environment variable:
     ```env
     REACT_APP_API_URL=https://your-railway-app.railway.app/api
     ```
   - [ ] Deploy and verify: `https://your-app.vercel.app`

4. **Update CORS Settings**
   - [ ] Add Vercel domain to backend CORS in `server/src/index.js`:
     ```javascript
     origin: [
       'https://metalogics.io',
       'https://www.metalogics.io',
       'https://your-app.vercel.app'
     ]
     ```
   - [ ] Redeploy backend to Railway

### Phase 3: Widget Integration

5. **Prepare Widget Script**
   - [ ] Update widget configuration with production URLs
   - [ ] Test widget functionality
   - [ ] Verify mobile responsiveness

6. **Add to metalogics.io**
   - [ ] Add widget script before `</body>` tag:
     ```html
     <script src="https://your-app.vercel.app/widget.js" async></script>
     ```
   - [ ] Test on staging environment first
   - [ ] Deploy to production

### Phase 4: Testing & Verification

7. **Functionality Testing**
   - [ ] Chat responses working correctly
   - [ ] Lead capture form submitting
   - [ ] Email confirmations sending
   - [ ] Appointment scheduling functional
   - [ ] Mobile widget responsive
   - [ ] Error handling graceful

8. **Performance Testing**
   - [ ] API response times < 2 seconds
   - [ ] Widget loads without blocking page
   - [ ] Database queries optimized
   - [ ] Rate limiting functional

## 🔧 Post-Deployment Configuration

### Analytics Setup
```javascript
// Add to metalogics.io for tracking
gtag('event', 'chat_widget_interaction', {
  event_category: 'engagement',
  event_label: 'ai_assistant'
});
```

### Monitoring Setup
- [ ] Set up Railway monitoring alerts
- [ ] Configure Vercel analytics
- [ ] Monitor database performance
- [ ] Set up error logging

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Verify domain in backend CORS settings
2. **API Timeouts**: Check Railway service status
3. **Widget Not Loading**: Verify Vercel deployment and script URL
4. **Database Errors**: Check Railway PostgreSQL connection
5. **Email Issues**: Verify SendGrid API key and from email

### Debug Commands
```bash
# Check backend health
curl https://your-railway-app.railway.app/api/health

# Test chat endpoint
curl -X POST https://your-railway-app.railway.app/api/chat/init

# Check frontend build
npm run build --prefix client
```

## ✅ Go-Live Checklist

- [ ] Backend deployed to Railway with health check passing
- [ ] Frontend deployed to Vercel and accessible
- [ ] Environment variables configured correctly
- [ ] CORS settings updated for production domains
- [ ] Widget script added to metalogics.io
- [ ] All functionality tested end-to-end
- [ ] Email notifications working
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Monitoring and alerts configured

**🎉 Your Metalogics AI Assistant is now live!**

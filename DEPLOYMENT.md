# Deployment Guide - Cyber Attack Visualizer

## Quick Summary

- **Frontend**: React + Tailwind CSS app deployed on **Vercel**
- **Backend**: Express.js server deployed on **Render**
- **Database**: SQLite (local to backend, auto-created)
- **API Keys Required**: Numverify, LeakCheck, AbuseIPDB, VirusTotal

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository connected to Vercel

### Step 1: Prepare Frontend

```bash
cd cyber-visualizer
npm run build  # Ensure build succeeds locally
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Connect your GitHub repository
4. Select the `cyber-visualizer` folder as root
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
VITE_API_URL=https://cyber-attack-visualizer-api.onrender.com
```

(Replace with your actual Render backend URL)

### Step 4: Deploy

Click "Deploy" and wait for the build to complete. Your frontend will be live at a `*.vercel.app` URL.

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- API keys from: Numverify, LeakCheck, AbuseIPDB, VirusTotal

### Step 1: Prepare Backend

```bash
cd cyber-backend
# Ensure .env file exists with all API keys
npm install
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `cyber-attack-visualizer-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `cyber-backend`

### Step 3: Add Environment Variables

In Render, go to "Environment" and add these variables:

```
PORT=5000
NUMVERIFY_API_KEY=<your-key>
LEAKCHECK_API_KEY=<your-key>
ABUSEIPDB_API_KEY=<your-key>
VIRUSTOTAL_API_KEY=<your-key>
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Replace each `<your-key>` with your actual API keys. Keep these private and use Render's secret management.

### Step 4: Deploy

Click "Deploy Service" and wait for the deployment to complete. Your backend will be available at:
```
https://cyber-attack-visualizer-api.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Frontend builds without errors on Vercel
- [ ] Backend server starts without errors on Render
- [ ] CORS is working (test API call from frontend)
- [ ] Phone validation returns "SAFE" (not "EXPOSED")
- [ ] Light/Dark theme switching works
- [ ] Search scan functionality works end-to-end
- [ ] Results modal displays correctly

### Test API Connectivity

From browser console on your Vercel frontend:

```javascript
fetch('https://cyber-attack-visualizer-api.onrender.com/')
  .then(r => r.json())
  .then(d => console.log(d))
```

You should see the backend's greeting message.

---

## Important Notes

### Database
- SQLite database is automatically created in the backend at `cyber-backend/database.db`
- On Render's free tier, files are ephemeral (lost on redeploy)
- For production, consider migrating to PostgreSQL (easy Render integration)

### Cold Starts
- Render's free tier has idle timeouts (spins down after 15 mins of inactivity)
- First request after idle will be slow (5-10s)
- Consider Render's paid tiers for faster performance

### Environment Variables
- **Never commit `.env` files to GitHub**
- Use platform-specific secret management (Vercel Secrets, Render Environment Variables)
- Keep API keys private

### CORS Configuration
- Backend automatically allows both local (`localhost:5173`) and production Vercel URLs
- To add more origins, update `FRONTEND_URL` in `.env` or Render settings

---

## Rolling Back

### Vercel
- Go to Deployments tab
- Click the deployment you want to revert to
- Click "Promote to Production"

### Render
- Go to Deploys tab
- Click "Redeploy" on any previous deployment

---

## Support

For issues with:
- **Vercel**: Check build logs in Vercel dashboard
- **Render**: Check deploy logs in Render dashboard
- **CORS errors**: Verify `FRONTEND_URL` is set correctly in backend
- **API keys**: Test directly via backend health check endpoint

---

## Next Steps

1. Monitor both services for errors in the first 24 hours
2. Set up error tracking (e.g., Sentry)
3. Consider migrating database to PostgreSQL for persistence
4. Implement rate limiting on backend
5. Add input validation and sanitization
6. Set up automated backups


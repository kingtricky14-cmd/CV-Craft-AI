# Netlify Deployment Guide for CVCraft AI

## ✅ Quick Start (5 minutes)

### Option 1: Drag & Drop (Easiest)
1. Build the app:
   ```bash
   npm run build
   ```
2. Go to [netlify.com](https://netlify.com) → Sign up (free)
3. Drag & drop the `dist` folder onto Netlify
4. Done! Your app is live with a `.netlify.app` domain

---

### Option 2: CLI Deployment (Recommended)
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify (opens browser)
netlify login

# Deploy
netlify deploy --prod --dir dist
```

---

### Option 3: GitHub Auto-Deploy (Best for Updates)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial CVCraft AI commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cvcraft-ai.git
git push -u origin main
```

#### Step 2: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Select **GitHub** and authorize
4. Select your `cvcraft-ai` repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

#### Step 3: Auto-deploy on Push
From now on, every `git push` automatically deploys!

---

## 🔧 Environment Variables

If using GitHub deploy, add your Supabase key:

1. In Netlify dashboard → **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add:
   ```
   VITE_API_URL = https://your-backend-api.com/api
   ```

Or for Supabase directly in frontend `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

---

## 📊 What Netlify Gives You (Free)

✅ **Hosting** - 100 GB/month bandwidth  
✅ **HTTPS** - SSL certificate included  
✅ **CDN** - Global content delivery  
✅ **PWA** - Fully supported  
✅ **Analytics** - Basic traffic stats  
✅ **Forms** - Free form submissions  
✅ **Functions** - 125,000 requests/month (for backend API calls)

---

## 🚀 Deploy Steps (CLI Method)

### 1. Build locally
```bash
cd frontend
npm run build
```

### 2. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 3. Login
```bash
netlify login
```
Browser opens → Authorize → Return to terminal

### 4. Deploy
```bash
netlify deploy --prod --dir dist
```

### Output:
```
Deploy path: /Users/you/cvcraft-ai/frontend/dist
Site ID: abcd1234efgh5678
URL: https://cvcraft-ai-123456.netlify.app
Live URL: https://cvcraft-ai-123456.netlify.app
```

---

## ✅ Post-Deployment Checklist

After deploying:

### 1. **Test PWA Installation**
- Android: Open in Chrome → Menu → Install app
- iOS: Safari → Share → Add to Home Screen
- Desktop: Browser bar shows install icon

### 2. **Check Service Worker**
- DevTools → Application → Service Workers
- Should show: "Active and running"

### 3. **Test Offline**
- DevTools → Network → Offline
- App should still load

### 4. **Verify HTTPS**
- URL should start with `https://`
- Browser shows lock icon

### 5. **Update Your Backend URL**
If backend is also deployed, update:
- Frontend `.env`: `VITE_API_URL=https://your-backend.com/api`
- Or set in Netlify environment variables

---

## 🔄 Update Your Domain (Optional)

### Add Custom Domain
1. **Netlify dashboard** → Site settings
2. **Domain management** → Add custom domain
3. Add your domain (e.g., `cvcraft.com`)
4. Update DNS records (Netlify shows instructions)
5. Wait 24-48 hours for propagation

---

## 🐛 Troubleshooting

### **PWA not installing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check HTTPS is enabled (required for PWA)
- Verify manifest.webmanifest exists in dist folder

### **Service Worker not updating?**
- DevTools → Application → Service Workers → Unregister
- Hard refresh browser
- Wait up to 1 hour for CDN cache

### **API calls failing?**
- Check backend is deployed and accessible
- Add backend URL to `netlify.toml` redirects if needed
- Check CORS headers on backend

### **Build failing on Netlify?**
- Check Netlify deploy logs: Site → Deploys → View logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

---

## 📈 Next: Deploy Backend

If you want to deploy your Express backend:

### Option A: **Render** (Free)
1. Push backend to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect repo
4. Deploy settings:
   - Build: `npm install`
   - Start: `npm start`
5. Done!

### Option B: **Railway** (Free tier)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select backend folder
4. Railway auto-detects Node.js setup
5. Done!

### Option C: **Heroku** ($0 - $7/month)
Free tier was removed, but cheapest option is $7/month dyno.

---

## 💡 Pro Tips

### 1. **Monitor Performance**
```bash
# Check build size
npx vite-bundle-visualizer
```

### 2. **Enable Netlify Analytics** (paid)
- Basic analytics free
- Advanced analytics: $9/month

### 3. **Setup Error Tracking**
Add Sentry for error monitoring:
```bash
npm install @sentry/react @sentry/tracing
```

### 4. **Auto-Redirect HTTP to HTTPS**
Already enabled in `netlify.toml`

---

## ✨ Your App is Now Global!

After deployment:
- 🌍 Accessible from any country
- 📱 Installable as native app
- 🚀 Lightning-fast with CDN
- 🔒 HTTPS encrypted
- 📊 Ready for users

**Ready to deploy? Run:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir dist
```

Got stuck? Check [Netlify docs](https://docs.netlify.com) or reach out!

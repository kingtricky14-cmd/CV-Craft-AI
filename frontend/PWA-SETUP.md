# PWA Setup Guide for CVCraft AI

## ✅ Setup Complete!

Your CVCraft AI application is now configured as a Progressive Web App (PWA). Here's what's been set up:

### What's Included:

1. **Service Worker** (`src/sw.js`)
   - Offline support and caching strategies
   - Automatic updates
   - API caching

2. **PWA Configuration** (`vite.config.js`)
   - Manifest generation
   - Icon configuration
   - App metadata

3. **Enhanced HTML** (`index.html`)
   - Apple mobile meta tags
   - PWA manifest link
   - Theme colors

4. **Service Worker Registration** (`src/main.jsx`)
   - Auto-registration on app load
   - Update notifications
   - Install prompts

---

## 🎨 Generate Icons (Required)

Before deploying, generate the required icons:

```bash
# Install sharp for image processing
npm install -D sharp

# Generate all PWA icons from SVG
node scripts/generate-icons.js
```

This will create:
- `icon-16x16.png`
- `icon-32x32.png`
- `icon-96x96.png`
- `icon-192x192.png`
- `icon-512x512.png`
- Maskable icon versions (for modern Android)

---

## 📱 Installation Methods

### Android
1. Open CVCraft AI in Chrome
2. Tap the **⋮** menu → "Install app"
3. App appears on home screen

### iOS
1. Open CVCraft AI in Safari
2. Tap the **Share** button
3. Tap "Add to Home Screen"
4. Confirm with app icon and name

### Desktop
1. Open in Chrome/Edge
2. Click the **+** icon in address bar
3. "Install CVCraft AI"
4. App runs in standalone window

---

## 🚀 Deployment

### Build for Production:
```bash
npm run build
```

### Deploy to Netlify (Free):
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

Your PWA will be available at: `https://yoursite.netlify.app`

### Deploy to Vercel (Free):
```bash
npm install -g vercel
vercel --prod
```

---

## 📊 Features Enabled

✅ Offline functionality  
✅ Auto-update on new versions  
✅ App install prompt  
✅ Home screen icon  
✅ Splash screen (iOS)  
✅ API caching (5 min)  
✅ Asset caching (30 days)  
✅ App shortcuts  

---

## 🔧 Optional Enhancements

### Add Install Button to Navbar:
```jsx
// In Navbar.jsx
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    setInstallPrompt(window.PWAInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  return (
    <nav>
      {/* ... navbar content ... */}
      {installPrompt && (
        <button onClick={handleInstall} className="...">
          📥 Install App
        </button>
      )}
    </nav>
  );
}
```

### Monitor Service Worker Updates:
Check browser DevTools → Application → Service Workers to see:
- Registration status
- Cache storage
- Offline test mode

---

## 📈 Next Steps

1. **Generate icons**: `node scripts/generate-icons.js`
2. **Test locally**: `npm run dev`
3. **Build**: `npm run build`
4. **Deploy**: Use Netlify or Vercel
5. **Test install**: Use your phone browser

---

## 🐛 Troubleshooting

**PWA not installing?**
- Check HTTPS is enabled (required for PWA)
- Clear browser cache and service workers
- Verify manifest.json is valid

**Offline not working?**
- Check DevTools → Application → Service Workers
- Verify cache storage in DevTools
- Check network in DevTools for cached requests

**Icons not showing?**
- Run `node scripts/generate-icons.js`
- Verify files in `/public` folder
- Hard refresh browser (Ctrl+Shift+R)

---

## 📚 Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

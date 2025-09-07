# Deployment Guide

## Pre-Deployment Checklist

- [ ] API key configured in environment variables
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Accessibility tests pass: `npm run test:a11y`
- [ ] Bundle size verified: `npm run build && ls -lh dist/`

## Environment Variables

```bash
# Required
VITE_POLYGON_API_KEY=your_polygon_api_key_here

# Optional
NODE_ENV=production
```

## Deployment Platforms

### Vercel

1. **Connect Repository**

   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Environment Variables**
   - Dashboard → Project → Settings → Environment Variables
   - Add `VITE_POLYGON_API_KEY`

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Netlify

1. **Deploy**

   ```bash
   npm run build
   # Drag dist/ folder to Netlify deploy
   ```

2. **Environment Variables**
   - Site Settings → Environment Variables
   - Add `VITE_POLYGON_API_KEY`

### AWS S3 + CloudFront

1. **Build and Upload**

   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket --delete
   ```

2. **CloudFront Distribution**
   - Origin: S3 bucket
   - Default Root Object: `index.html`
   - Error Pages: 404 → `/index.html` (SPA routing)

## Security Configuration

### API Key Protection

**Current Limitation**: Frontend apps expose API keys in browser network tab.

**Mitigation Options**:

1. **Domain Restrictions** (Polygon Dashboard)
   - Restrict API key to specific domains
   - Monitor usage in Polygon dashboard

2. **Backend Proxy** (Recommended for Production)

   ```javascript
   // pages/api/polygon/[...path].js (Next.js example)
   export default async function handler(req, res) {
     const path = req.query.path.join('/');
     const url = `https://api.polygon.io/${path}?${new URLSearchParams(req.query).toString()}&apikey=${process.env.POLYGON_API_KEY}`;

     const response = await fetch(url);
     const data = await response.json();

     res.json(data);
   }
   ```

3. **Serverless Functions**
   ```javascript
   // netlify/functions/polygon.js
   exports.handler = async event => {
     const response = await fetch(
       `https://api.polygon.io${event.path}?apikey=${process.env.POLYGON_API_KEY}`
     );
     return {
       statusCode: 200,
       body: JSON.stringify(await response.json()),
     };
   };
   ```

### Rate Limiting

- Free tier: 5 calls/minute
- App implements intelligent caching to prevent rate limits
- TanStack Query staleTime prevents redundant requests

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/
```

### CDN Configuration

```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# SPA routing
location / {
    try_files $uri $uri/ /index.html;
}
```

## Monitoring

### Error Tracking

```javascript
// Add to main.tsx
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
  // Send to monitoring service
});
```

### Performance Monitoring

```javascript
// Add to App.tsx
useEffect(() => {
  // Track Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}, []);
```

## Troubleshooting

### Common Issues

**Build Fails**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API Key Not Working**

- Verify key in Polygon dashboard
- Check environment variable name: `VITE_POLYGON_API_KEY`
- Restart dev server after adding env vars

**Rate Limit Errors**

- Check Polygon dashboard usage
- Verify caching is working (Network tab)
- Consider upgrading Polygon plan

**Chart Not Loading**

- Check browser console for errors
- Verify Highcharts license (free for non-commercial)
- Test with sample data

### Production Debugging

```bash
# Build and serve locally
npm run build
npm run preview

# Check bundle contents
npx vite-bundle-analyzer dist/
```

## Backup and Recovery

### Data Backup

- No user data stored (stateless app)
- Configuration in URL parameters
- API key in environment variables

### Rollback Strategy

```bash
# Vercel
vercel --prod --force

# Netlify
netlify deploy --prod --dir=dist

# Manual
git checkout previous-tag
npm run build
# Deploy dist/
```

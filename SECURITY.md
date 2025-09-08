# Security Guide

## API Key Security

### ⚠️ Critical Frontend Limitation

**API keys are visible in browser network requests** - this is an inherent limitation of frontend-only applications.

Anyone can:

- Open browser DevTools → Network tab
- See API requests with keys
- Extract and reuse your API key

### Current Security Measures

1. **Environment Variables**

   ```bash
   # .env (never commit)
   VITE_POLYGON_API_KEY=your_key_here
   ```

2. **Git Protection**
   - `.env` in `.gitignore`
   - `.env.example` with placeholders only

3. **Rate Limiting**
   - TanStack Query caching prevents redundant calls
   - 5-minute stale time reduces API usage
   - Built-in retry logic with backoff

### Production Security Options

#### Option 1: Domain Restrictions (Minimum)

```bash
# Polygon Dashboard Settings
Allowed Domains: yourdomain.com, www.yourdomain.com
Allowed IPs: (leave empty for domain-only)
```

#### Option 2: Backend Proxy (Recommended)

**Next.js API Route**

```javascript
// pages/api/polygon/[...path].js
export default async function handler(req, res) {
  const { path, ...query } = req.query;
  delete query.path;

  const url = new URL(`https://api.polygon.io/${path.join('/')}`);
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set('apikey', process.env.POLYGON_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'API request failed' });
  }
}
```

**Serverless Function (Netlify)**

```javascript
// netlify/functions/polygon.js
exports.handler = async event => {
  const { path } = event;
  const query = new URLSearchParams(event.queryStringParameters);
  query.set('apikey', process.env.POLYGON_API_KEY);

  const response = await fetch(`https://api.polygon.io${path}?${query}`);
  const data = await response.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
```

**Update Frontend for Proxy**

```typescript
// services/polygonApi.ts
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? '/api/polygon' // Use proxy in production
    : 'https://api.polygon.io'; // Direct API in development
```

#### Option 3: Serverless Backend

**Vercel Functions**

```javascript
// api/polygon.js
export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting per IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Implement rate limiting logic here

  const response = await fetch(
    `https://api.polygon.io${req.url}?apikey=${process.env.POLYGON_API_KEY}`
  );
  const data = await response.json();

  res.json(data);
}
```

## API Key Management

### Key Rotation Process

1. **Generate New Key**
   - Login to Polygon dashboard
   - Create new API key
   - Test with curl/Postman

2. **Update Environment**

   ```bash
   # Update production environment
   VITE_POLYGON_API_KEY=new_key_here
   ```

3. **Deploy and Verify**

   ```bash
   npm run build
   # Deploy to production
   # Test application functionality
   ```

4. **Revoke Old Key**
   - Delete old key from Polygon dashboard
   - Monitor for any errors

### Monitoring and Alerts

**Usage Monitoring**

```javascript
// Import from monitoring script
import {
  logApiUsage,
  reportSecurityEvent,
} from '../scripts/api-usage-monitor.js';

// Add to API service
const logApiUsage = (endpoint, response) => {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    status: response.status,
    remaining: response.headers.get('X-RateLimit-Remaining'),
  });
};
```

**Error Tracking**

```javascript
// Add to error boundary
const reportSecurityEvent = error => {
  if (error.message.includes('403') || error.message.includes('401')) {
    // Report potential API key compromise
    console.error('Potential API key issue:', error);
  }
};
```

**Monitoring Scripts**

```bash
# Available monitoring utilities
node scripts/api-usage-monitor.js    # API usage analysis
npm run build:check                  # Bundle size monitoring
```

## Content Security Policy

```html
<!-- Add to index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.polygon.io;
  img-src 'self' data: https:;
  font-src 'self';
"
/>
```

## HTTPS Configuration

### Development

```bash
# Vite with HTTPS
npm run dev -- --https
```

### Production

- Always use HTTPS in production
- Configure SSL certificates
- Redirect HTTP to HTTPS

## Vulnerability Management

### Dependencies

```bash
# Regular security audits
npm audit
npm audit fix

# Update dependencies
npm update
```

### Security Headers

```javascript
// Add to server configuration
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

## Incident Response

### API Key Compromise

1. **Immediate**: Revoke compromised key in Polygon dashboard
2. **Generate**: Create new API key
3. **Update**: Deploy with new key
4. **Monitor**: Check usage patterns for abuse
5. **Review**: Analyze how compromise occurred

### Unusual Usage Patterns

1. Check Polygon dashboard for usage spikes
2. Review application logs for errors
3. Verify rate limiting is working
4. Consider temporary key rotation

## Best Practices

- ✅ Use environment variables for API keys
- ✅ Never commit secrets to git
- ✅ Implement rate limiting and caching
- ✅ Monitor API usage regularly
- ✅ Use domain restrictions when possible
- ✅ Consider backend proxy for production
- ❌ Don't hardcode API keys
- ❌ Don't ignore security warnings
- ❌ Don't skip dependency updates

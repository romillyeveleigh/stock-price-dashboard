# Stock Price Dashboard

Professional financial dashboard for visualizing historical stock price data from the US Stock Exchange. Built for fund managers to analyze up to 3 stocks simultaneously with interactive time series charts.

## Features

- **Stock Search**: Server-side search with 3+ character minimum
- **Interactive Charts**: Line charts with crosshairs, zoom, and volume display
- **Price Types**: Toggle between Open, High, Low, Close prices
- **Date Ranges**: Custom ranges with quick presets (1M, 3M, 6M, YTD, 1Y)
- **URL Sharing**: Bookmark and share chart configurations
- **Responsive**: Desktop, tablet, and mobile optimized
- **Accessible**: WCAG compliant with keyboard navigation

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd stock-price-dashboard
npm install

# Set up API key
cp .env.example .env
# Edit .env and add your Polygon.io API key

# Start development
npm run dev
```

## API Setup

1. Get free API key at [polygon.io](https://polygon.io/) (5 calls/minute)
2. Add to `.env`: `VITE_POLYGON_API_KEY=your_key_here`

**⚠️ Security Note**: API keys are visible in browser network tab (frontend limitation). For production, use a backend proxy.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Charts**: Highcharts Stock for time series
- **State**: React Context + TanStack Query
- **Styling**: Tailwind CSS + Shadcn/ui
- **API**: Polygon.io REST API

**Chart Design**: Line charts chosen for clear multi-stock trend visualization with responsive UX, prioritizing simplicity over candlestick complexity for historical analysis.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run test:a11y    # Accessibility tests
npm run lint         # Lint code
npm run format       # Format code
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy dist/ folder to Vercel
# Add VITE_POLYGON_API_KEY to environment variables
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
# Add VITE_POLYGON_API_KEY to environment variables
```

### Production Security

**Current**: API key visible in browser (frontend limitation)

**Recommended**: Backend proxy to hide API keys

```javascript
// Example serverless function
export default async function handler(req, res) {
  const response = await fetch(
    `https://api.polygon.io${req.url}?apikey=${process.env.POLYGON_API_KEY}`
  );
  const data = await response.json();
  res.json(data);
}
```

## Performance

- Bundle size: <500KB (native fetch vs 1.37MB SDK)
- Caching: 5min stale time prevents redundant API calls
- Code splitting: Lazy-loaded chart components
- Rate limiting: Built-in request queuing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

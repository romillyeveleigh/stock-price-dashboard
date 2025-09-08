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
git clone https://github.com/romillyeveleigh/stock-price-dashboard.git
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

- **Frontend**: React 19 + TypeScript + Vite
- **Charts**: Highcharts Stock for time series
- **State**: React Context + TanStack Query
- **Styling**: Tailwind CSS + Shadcn/ui
- **API**: Polygon.io REST API

**Chart Design**: Line charts chosen for clear multi-stock trend visualization with responsive UX, prioritizing simplicity over candlestick complexity for historical analysis.

## Scripts

```bash
# Development
npm run dev          # Development server
npm run preview      # Preview production build

# Building
npm run build        # Production build
npm run build:check  # Build and check bundle sizes
npm run build:analyze # Build with bundle analysis

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests with Playwright
npm run test:e2e:ui  # Run E2E tests with UI mode
npm run test:e2e:headed # Run E2E tests in headed mode
npm run test:e2e:debug  # Run E2E tests in debug mode

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Lint and fix code
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking

# Bundle Analysis
npm run analyze      # Analyze bundle composition
npm run size-check   # Check current bundle sizes
npm run size-report  # Generate size report
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

- Bundle size: ~1,177KB total (optimized chunks, native fetch vs 1.37MB SDK)
- Largest chunk: 372KB (well within 500KB limit per chunk)
- Caching: 5min stale time prevents redundant API calls
- Code splitting: Intelligent chunk splitting with 7 optimized bundles
- Rate limiting: Built-in request queuing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

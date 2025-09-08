# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA                                │
├─────────────────────────────────────────────────────────────┤
│  StockSearch  │  DateRange   │  PriceToggle │  SelectedStocks│
├─────────────────────────────────────────────────────────────┤
│              Highcharts Stock Chart                         │
├─────────────────────────────────────────────────────────────┤
│     Context State    │    TanStack Query (Server State)     │
├─────────────────────────────────────────────────────────────┤
│              Polygon API Service Layer                      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer            | Technology                 | Purpose                     |
| ---------------- | -------------------------- | --------------------------- |
| **Frontend**     | React 19 + TypeScript      | Component-based UI          |
| **State**        | React Context + useReducer | UI state management         |
| **Server State** | TanStack Query             | API caching & sync          |
| **Charts**       | Highcharts Stock           | Time series visualization   |
| **Styling**      | Tailwind + Shadcn/ui       | Responsive design system    |
| **Build**        | Vite                       | Fast development & bundling |
| **API**          | Polygon.io REST            | Stock data source           |

## Component Architecture

### Core Components

```typescript
App
├── ErrorBoundary
├── QueryClientProvider
├── BrowserRouter
├── AppProvider (Context)
└── Layout
    ├── StockSearch
    ├── DateRangePicker
    ├── PriceTypeToggle
    ├── SelectedStocks
    └── StockChart
```

### State Management

**UI State (React Context)**

- Selected stocks (max 3)
- Date range selection
- Price type (open/high/low/close)
- Loading states

**Server State (TanStack Query)**

- Stock search results
- Historical price data
- API error handling
- Caching & background refetch

### Data Flow

1. **User Input** → Component state
2. **State Change** → Context dispatch
3. **API Trigger** → TanStack Query
4. **Data Fetch** → Polygon API
5. **Cache Update** → Component re-render
6. **Chart Update** → Highcharts

## API Integration

### Endpoints Used

```typescript
// Stock search (server-side filtering)
GET /v3/reference/tickers?search={query}&market=stocks&active=true

// Historical prices
GET /v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}?adjusted=true
```

### Caching Strategy

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min - prevent redundant calls
      gcTime: 30 * 60 * 1000, // 30 min - memory cleanup
      refetchOnWindowFocus: false, // Prevent unnecessary refetch
      retry: 2, // Limited retries
    },
  },
});
```

## Performance Optimizations

### Bundle Size

- **Native fetch** instead of 1.37MB Polygon SDK
- **Tree shaking** removes unused code
- **Intelligent chunk splitting** with 7 optimized bundles
- **Current**: ~1,177KB total (372KB largest chunk)
- **Target**: <500KB per chunk (achieved ✅)

### API Efficiency

- **Server-side search** (3+ characters minimum)
- **Debounced inputs** prevent excessive calls
- **Intelligent caching** via TanStack Query
- **Rate limit handling** with retry logic

### Chart Performance

- **Line charts** over candlesticks (simpler rendering)
- **Data grouping** for large datasets
- **Lazy loading** of Highcharts modules
- **Memory cleanup** on component unmount

## Security Architecture

### Current (Development)

```
Browser → Direct API → Polygon.io
         (API key visible)
```

### Recommended (Production)

```
Browser → Backend Proxy → Polygon.io
         (API key hidden)
```

## Responsive Design

### Breakpoints

- **Mobile**: <768px - Stacked layout
- **Tablet**: 768-1024px - Condensed sidebar
- **Desktop**: >1024px - Full sidebar layout

### Layout Strategy

- **Desktop**: Sidebar + main chart area
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom drawer navigation

## Error Handling

### Error Boundaries

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Error Types

- **Rate Limits** (429) - Show retry timer
- **Invalid Symbol** (404) - Clear error message
- **Network Errors** - Retry with backoff
- **Validation Errors** - Real-time feedback

## Testing Strategy

### Unit Tests

- Component rendering
- State management
- API service functions
- Utility functions

### Integration Tests

- User workflows
- API integration
- URL synchronization
- Error scenarios

### Accessibility Tests

- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA labels

## Build & Deployment

### Development

```bash
npm run dev          # Vite dev server
npm run test         # Jest test runner
npm run test:watch   # Jest in watch mode
npm run lint         # ESLint + Prettier
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript checking
```

### Production

```bash
npm run build        # TypeScript + Vite build
npm run build:check  # Build with size analysis
npm run preview      # Preview production build
npm run analyze      # Bundle composition analysis
```

### CI/CD Pipeline

1. **Lint** - Code quality checks
2. **Test** - Unit & integration tests
3. **Build** - Production bundle
4. **Deploy** - Static hosting (Vercel/Netlify)

## Scalability Considerations

### Current Limitations

- 3 stock maximum (UI constraint)
- 5 API calls/minute (free tier)
- Client-side only (no backend)

### Future Enhancements

- Backend proxy for security
- Real-time data (WebSocket)
- Advanced indicators
- Portfolio tracking
- User authentication

## Version Notes

### React 19 Migration

The application has been updated to React 19, which includes:

- Improved concurrent features
- Better TypeScript support
- Enhanced performance optimizations
- New React Compiler compatibility

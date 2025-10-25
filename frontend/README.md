# Drone Photo GPS Visualizer - Frontend

React + TypeScript frontend for interactive map visualization of drone photos.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# For development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and update values:

```bash
cp .env.example .env.local
```

### API Integration

The frontend communicates with the backend via REST API at `/api/v1/`.

The Vite dev server is configured to proxy `/api` requests to `http://localhost:8000`.

## Testing

### Run Tests

```bash
# All tests
npm run test

# With coverage
npm run test:coverage

# Watch mode
npm run test -- --watch

# UI
npm run test:ui
```

### Test Structure

```
tests/
├── unit/
│   └── components/         # Component tests
│   └── services/           # Service/hook tests
├── integration/            # Workflow tests
└── e2e/                    # End-to-end tests
```

## Code Quality

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components by feature
│   │   ├── Map/
│   │   ├── PhotoImport/
│   │   ├── PhotoList/
│   │   ├── Filters/
│   │   ├── FlightStats/
│   │   ├── Export/
│   │   ├── Collections/
│   │   └── Common/
│   ├── pages/              # Page components
│   ├── services/           # API client and utilities
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # E2E tests
├── public/                 # Static assets
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
└── README.md
```

## Component Development

Components follow these conventions:

1. One component per file
2. Descriptive prop interfaces
3. Prop destructuring in parameters
4. React hooks for state management
5. Comments for complex logic
6. Exported named exports

## Styling

Use CSS modules or plain CSS files as needed. Global styles in `src/styles/index.css`.

Responsive design breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## API Client

The API client (`src/services/api.ts`) is configured with:
- Base URL from environment variables
- Axios interceptors for error handling
- Request/response logging in development
- Automatic CSRF token handling

## State Management

Uses:
- React Query for server state
- React Context for global UI state
- Zustand for complex state (if needed)

## Deployment

```bash
# Build production bundle
npm run build

# Output in dist/ directory
# Deploy dist/ to static host
```

## Contributing

- Follow the Constitution.md principles
- Write tests for new features
- Use `npm run format` before committing
- Ensure `npm run type-check` passes
- Keep components small and focused

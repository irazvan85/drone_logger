# Implementation Plan: Drone Photo GPS Visualizer

**Branch**: `001-drone-photo-gps-visualizer` | **Date**: 2025-10-25 | **Spec**: `spec-drone-photo-gps-visualizer.md`

## Summary

Build a full-stack web application that allows users to import drone photos from a folder, automatically extract GPS metadata from EXIF data, and visualize photo locations on an interactive map. The system will support filtering, statistics calculation, and multi-format export (GeoJSON, CSV, KML). Architecture: Python FastAPI backend for GPS extraction and data processing, React/TypeScript frontend for interactive map visualization with Leaflet.js, with SQLite for local data persistence.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend), Node.js 18+ (frontend build)

**Primary Dependencies**:

- Backend: FastAPI (web framework), Pillow + piexif (EXIF extraction), SQLAlchemy (ORM), Pydantic (validation), geopy (geospatial calculations)
- Frontend: React 18+, TypeScript, Leaflet.js (mapping), Vite (bundler), Axios (HTTP client), React Query (state management)
- Testing: pytest (Python), Vitest + React Testing Library (JavaScript), pytest-cov (coverage)

**Storage**: SQLite with SQLAlchemy ORM (local file-based, no external database required for MVP)  
**Testing**: pytest with fixtures for Python backend, Vitest with React Testing Library for frontend  
**Target Platform**: Web (Chrome, Firefox, Safari, Edge latest versions), responsive design for desktop and tablets

**Project Type**: Full-stack web application (separate backend and frontend directories)

**Performance Goals**:

- Photo extraction: <10 seconds for 1,000 photos
- Map rendering: <100ms for pan/zoom operations
- API response time: <200ms for typical requests
- Frontend bundle size: <500KB (gzipped)

**Constraints**:

- Memory usage: <500MB RAM for 1,000 photos
- No external dependencies for mapping (self-hosted tiles option)
- File system access limited to user-selected import folders only
- Offline capability: map tiles cached in browser

**Scale/Scope**: Single-user application (local deployment), support for 10,000 photos per collection, multiple independent collections

## Constitution Check

### GATE: Must pass before Phase 0 research

✅ **Code Quality First**: Architecture uses SOLID principles with separation of concerns (backend/frontend), clear module structure, type safety via TypeScript and Pydantic  
✅ **Test-First Development**: Testing frameworks selected (pytest, Vitest), coverage threshold set to 80%  
✅ **User Experience Consistency**: Single UI framework (React), consistent component patterns, responsive design standards  
✅ **Performance Excellence**: Performance targets defined (see above), monitoring built into plan  
✅ **Comprehensive Documentation**: API documentation via FastAPI auto-docs, component documentation, type hints throughout  

**No Constitutional Violations Identified** - All requirements align with project principles.

## Project Structure

### Documentation (this feature)

```text
.specify/memory/
├── spec-drone-photo-gps-visualizer.md      # Feature specification
├── plan-drone-photo-gps-visualizer.md      # This file
├── research-drone-photo-gps-visualizer.md  # Phase 0 research (TBD)
├── data-model-drone-photo-gps-visualizer.md # Phase 1 data model (TBD)
├── quickstart-drone-photo-gps-visualizer.md # Phase 1 quickstart (TBD)
├── contracts/                               # Phase 1 API contracts (TBD)
│   ├── gps-extraction-api.md
│   ├── photo-collection-api.md
│   └── export-api.md
└── tasks-drone-photo-gps-visualizer.md     # Phase 2 task breakdown (TBD)
```

### Source Code (repository root)

```text
drone_logger/
├── backend/                          # Python FastAPI application
│   ├── src/
│   │   ├── app.py                   # FastAPI application entry point
│   │   ├── config.py                # Configuration and environment variables
│   │   ├── models/                  # SQLAlchemy data models
│   │   │   ├── __init__.py
│   │   │   ├── photo.py             # Photo, PhotoMetadata models
│   │   │   ├── gps_location.py      # GPSLocation model
│   │   │   ├── flight.py            # Flight model (derived from photos)
│   │   │   ├── collection.py        # Collection model
│   │   │   └── base.py              # Base model for SQLAlchemy
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   │   ├── __init__.py
│   │   │   ├── photo.py             # PhotoCreate, PhotoResponse, etc.
│   │   │   ├── gps_location.py      # GPSLocationResponse, etc.
│   │   │   ├── flight.py            # FlightResponse with statistics
│   │   │   ├── collection.py        # CollectionCreate, CollectionResponse
│   │   │   └── export.py            # ExportRequest, ExportResponse
│   │   ├── services/                # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── gps_extractor.py     # EXIF extraction logic
│   │   │   ├── photo_processor.py   # Photo import and processing
│   │   │   ├── flight_analyzer.py   # Flight path and statistics
│   │   │   ├── export_service.py    # GeoJSON, CSV, KML export
│   │   │   └── collection_manager.py # Collection management
│   │   ├── api/                     # API routes
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── routes.py        # Main router combining all endpoints
│   │   │   │   ├── collections.py   # Collection endpoints
│   │   │   │   ├── photos.py        # Photo endpoints
│   │   │   │   ├── flights.py       # Flight endpoints
│   │   │   │   ├── locations.py     # GPS location endpoints
│   │   │   │   └── exports.py       # Export endpoints
│   │   ├── db/                      # Database configuration
│   │   │   ├── __init__.py
│   │   │   ├── session.py           # SQLAlchemy session management
│   │   │   └── init_db.py           # Database initialization
│   │   ├── utils/                   # Utilities
│   │   │   ├── __init__.py
│   │   │   ├── geospatial.py        # GPS calculations (distance, bounds)
│   │   │   ├── file_utils.py        # File system operations
│   │   │   ├── validators.py        # Input validation
│   │   │   └── errors.py            # Custom exceptions
│   │   └── middleware/              # Request/response middleware
│   │       ├── __init__.py
│   │       └── error_handler.py     # Global error handling
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── unit/
│   │   │   ├── __init__.py
│   │   │   ├── test_gps_extractor.py
│   │   │   ├── test_photo_processor.py
│   │   │   ├── test_flight_analyzer.py
│   │   │   ├── test_export_service.py
│   │   │   └── test_geospatial_utils.py
│   │   ├── integration/
│   │   │   ├── __init__.py
│   │   │   ├── test_import_workflow.py      # Import → Extract → Store
│   │   │   ├── test_collection_workflow.py  # Collection CRUD
│   │   │   ├── test_export_workflow.py      # Export all formats
│   │   │   └── test_flight_calculation.py   # Flight analysis
│   │   ├── fixtures/
│   │   │   ├── __init__.py
│   │   │   ├── sample_photos.py    # Test photo data
│   │   │   ├── gps_data.py         # Sample GPS coordinates
│   │   │   └── db.py               # Test database setup
│   │   └── conftest.py             # pytest configuration
│   ├── requirements.txt            # Python dependencies
│   ├── requirements-dev.txt        # Development dependencies
│   ├── pyproject.toml              # Project metadata
│   ├── .env.example                # Environment variables template
│   └── README.md                   # Backend documentation

├── frontend/                        # React TypeScript application
│   ├── src/
│   │   ├── main.tsx               # React entry point
│   │   ├── App.tsx                # Main app component
│   │   ├── components/
│   │   │   ├── Map/               # Map visualization components
│   │   │   │   ├── MapContainer.tsx      # Main map wrapper
│   │   │   │   ├── MapMarkers.tsx        # Marker rendering
│   │   │   │   ├── MapControls.tsx       # Zoom, pan controls
│   │   │   │   └── MarkerPopup.tsx       # Marker info popup
│   │   │   ├── PhotoImport/      # Photo import components
│   │   │   │   ├── FolderSelector.tsx    # Folder/file selection
│   │   │   │   ├── ImportProgress.tsx    # Progress indicator
│   │   │   │   └── ImportSummary.tsx     # Import results
│   │   │   ├── PhotoList/         # Photo list/gallery components
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   ├── PhotoCard.tsx
│   │   │   │   └── PhotoDetails.tsx
│   │   │   ├── Filters/           # Filter components
│   │   │   │   ├── DateRangeFilter.tsx
│   │   │   │   ├── BoundingBoxFilter.tsx
│   │   │   │   └── FilterPanel.tsx
│   │   │   ├── FlightStats/       # Flight statistics display
│   │   │   │   ├── StatsPanel.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── FlightPath.tsx
│   │   │   ├── Export/            # Export components
│   │   │   │   ├── ExportDialog.tsx
│   │   │   │   ├── ExportOptions.tsx
│   │   │   │   └── ExportStatus.tsx
│   │   │   ├── Collections/       # Collection management
│   │   │   │   ├── CollectionSelector.tsx
│   │   │   │   ├── CollectionList.tsx
│   │   │   │   └── CollectionForm.tsx
│   │   │   └── Common/            # Shared components
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Main dashboard/map page
│   │   │   ├── Collections.tsx     # Collections management
│   │   │   ├── Settings.tsx        # Application settings
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── services/
│   │   │   ├── api.ts             # API client using Axios
│   │   │   ├── storage.ts         # LocalStorage utilities
│   │   │   ├── mapHelpers.ts      # Map interaction helpers
│   │   │   └── fileHelpers.ts     # File system access helpers
│   │   ├── hooks/
│   │   │   ├── usePhotos.ts       # Photos query/mutation hooks
│   │   │   ├── useCollections.ts  # Collections hooks
│   │   │   ├── useMap.ts          # Map state hook
│   │   │   ├── useFilters.ts      # Filter state hook
│   │   │   └── useExport.ts       # Export functionality hook
│   │   ├── types/
│   │   │   ├── index.ts           # TypeScript type definitions
│   │   │   ├── api.ts             # API response types
│   │   │   └── domain.ts          # Domain model types
│   │   ├── store/                 # Global state (if using Zustand)
│   │   │   ├── index.ts
│   │   │   ├── photoStore.ts
│   │   │   └── uiStore.ts
│   │   ├── styles/
│   │   │   ├── index.css          # Global styles
│   │   │   ├── components.css
│   │   │   └── map.css
│   │   └── utils/
│   │       ├── formatting.ts      # Format coordinates, dates
│   │       ├── geomath.ts         # Client-side geo calculations
│   │       └── validation.ts      # Input validation
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   │   └── api.test.ts
│   │   │   ├── hooks/
│   │   │   │   ├── usePhotos.test.ts
│   │   │   │   └── useMap.test.ts
│   │   │   └── utils/
│   │   │       ├── formatting.test.ts
│   │   │       └── geomath.test.ts
│   │   ├── integration/
│   │   │   ├── import-workflow.test.tsx
│   │   │   ├── filter-workflow.test.tsx
│   │   │   └── export-workflow.test.tsx
│   │   ├── e2e/
│   │   │   ├── import-and-display.spec.ts     # E2E test
│   │   │   ├── filter-photos.spec.ts
│   │   │   └── export-data.spec.ts
│   │   └── setup.ts               # Test configuration
│   ├── public/                    # Static assets
│   │   ├── index.html
│   │   └── manifest.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md

└── README.md                        # Project root documentation
```

**Structure Decision**: Full-stack web application with separate backend and frontend directories. Backend handles all GPS extraction, data processing, and business logic via REST API. Frontend provides reactive UI for map visualization and user interactions. This separation enables independent development, testing, and deployment of each layer.

## Phase Breakdown

### Phase 0: Research & Architecture (2-3 days)

- [ ] Document technology choices and trade-offs
- [ ] Research EXIF libraries (piexif, Pillow) and choose best option
- [ ] Prototype GPS extraction pipeline with sample photos
- [ ] Evaluate mapping libraries (Leaflet vs Maplibre vs Mapbox)
- [ ] Design API contract for core endpoints
- [ ] Research export format libraries (geojson, kml)
- [ ] Create architecture decision records (ADRs)

### Phase 1: Project Setup & Infrastructure (2-3 days)

- [ ] Initialize both backend and frontend projects
- [ ] Configure linting, testing, and CI/CD tools
- [ ] Create project structure and documentation

### Phase 2: Foundational Infrastructure (3-4 days)

- [ ] Implement core backend infrastructure (DB, Error Handling, Utils)
- [ ] Implement core frontend infrastructure (API Client, Layout, Routing)
- [ ] **BLOCKER**: Must be complete before User Stories

### Phase 3: User Story 1 - Import Photos and Extract GPS Metadata (P1)

- [ ] Implement Photo and Collection models
- [ ] Implement GPS extraction service
- [ ] Implement Import UI and Photo List
- [ ] **Deliverable**: Working import workflow

### Phase 4: User Story 2 - Display Photos on Interactive Map (P1)

- [ ] Implement Location models and services
- [ ] Implement Map component with Leaflet
- [ ] Integrate Map with Photo data
- [ ] **Deliverable**: Interactive Map visualization (MVP Complete)

### Phase 5: User Story 3 - Browse and Filter Photos by Location (P2)

- [ ] Implement Date Range and Bounding Box filters
- [ ] Implement real-time map updates
- [ ] **Deliverable**: Advanced filtering capabilities

### Phase 6: User Story 4 - Export and Share Flight Data (P2)

- [ ] Implement Export service (GeoJSON, CSV, KML)
- [ ] Implement Export UI
- [ ] **Deliverable**: Data export functionality

### Phase 7: User Story 5 - Visualize Flight Path and Statistics (P3)

- [ ] Implement Flight analysis logic (path, stats)
- [ ] Implement Flight Path visualization on map
- [ ] **Deliverable**: Flight analytics

### Phase 8: Cross-Cutting Concerns & Polish (2-3 days)

- [ ] Performance optimization
- [ ] Accessibility and Responsive Design
- [ ] Final Testing and Documentation

## Development Environment Setup

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-dev.txt

# Initialize database
python -m src.db.init_db

# Run development server
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server on http://localhost:5173
```

### Running Tests

```bash
# Backend unit tests
pytest tests/unit -v --cov=src --cov-report=html

# Backend integration tests
pytest tests/integration -v

# Frontend tests
npm run test
npm run test:coverage
```

## Success Metrics

### Development Milestones

1. ✅ Phase 0 complete: All technical decisions documented
2. ✅ Phase 1 complete: Data model and API contracts approved
3. ✅ Phase 2 complete: Backend 80% tested, core services working
4. ✅ Phase 3 complete: Frontend renders map with sample data
5. ✅ Phase 4 complete: All P1 and P2 features implemented
6. ✅ Phase 5 complete: All tests passing, performance targets met
7. ✅ Phase 6 complete: Application ready for MVP release

### Quality Gates (Per Constitution)

- [ ] Code coverage >80% for both backend and frontend
- [ ] All PR reviews completed by designated reviewers
- [ ] Linting and formatting pass without warnings
- [ ] All automated tests passing in CI/CD pipeline
- [ ] Performance tests confirm <10s extraction for 1000 photos
- [ ] Security review completed (no critical findings)
- [ ] Cross-browser testing completed successfully
- [ ] Accessibility audit (WCAG 2.1 Level AA) passed

## Dependencies & Tools

### Backend

- **Framework**: FastAPI (modern, async, auto-documentation)
- **Database ORM**: SQLAlchemy (flexible, well-tested)
- **Validation**: Pydantic (type-safe, auto-validation)
- **Image Processing**: Pillow + piexif (EXIF extraction)
- **Geospatial**: geopy (distance calculations)
- **Testing**: pytest, pytest-cov, pytest-asyncio
- **Code Quality**: black, flake8, mypy

### Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast, modern)
- **Map Library**: Leaflet.js (open-source, lightweight)
- **HTTP Client**: Axios (promise-based, interceptors)
- **State Management**: React Query + Context API (or Zustand)
- **Testing**: Vitest, React Testing Library, Playwright (E2E)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### DevOps

- **Version Control**: Git with feature branch workflow
- **CI/CD**: GitHub Actions (Python linting, testing; Node linting, testing, build)
- **Database**: SQLite (local file, no external dependency)
- **Server**: Python server (Uvicorn) + static frontend server

## Complexity Justification

| Aspect | Justification |
|--------|---------------|
| Dual-layer architecture | Required for separation of concerns (business logic vs. UI) per SOLID principles |
| TypeScript frontend | Ensures type safety and reduces runtime errors in interactive map component |
| SQLAlchemy ORM | Provides data abstraction for future database migration if needed |
| Comprehensive testing | Constitution requires >80% coverage and testing-first approach non-negotiable |
| API versioning (v1 routes) | Allows backward compatibility for future features without breaking clients |

## Open Questions & NEEDS CLARIFICATION

- **Deployment Target**: Should this be deployed as a Docker container or standalone Python app?
- **Authentication**: Should multi-user support be considered, or is single-user sufficient for MVP?
- **Map Tiles**: Should we use free tile providers (OpenStreetMap) or support custom tile servers?
- **Database**: Should we consider cloud database support for future multi-user version?
- **Real-time Updates**: Should WebSocket support be considered for live photo updates during import?


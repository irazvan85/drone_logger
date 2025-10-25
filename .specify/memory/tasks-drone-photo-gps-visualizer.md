# Tasks: Drone Photo GPS Visualizer

**Input**: Specification and plan documents  
**Prerequisites**: `spec-drone-photo-gps-visualizer.md` (required), `plan-drone-photo-gps-visualizer.md` (required)  
**Duration**: 16-18 development days (estimated)  
**Tests**: Included (test-first approach per Constitution)

**Organization**: Tasks are grouped by user story and phase to enable independent implementation. Each user story is independently testable and deliverable.

## Format: `[ID] [P?] [Story] Description`

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3, US4, US5, or FOUNDATION)
- **Exact file paths** included for clear implementation location

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Shared configs**: Project root

---

## Phase 1: Project Setup & Infrastructure (2-3 days)

**Purpose**: Initialize both backend and frontend projects with proper structure, tooling, and configuration

- [ ] T001 [P] Create project directory structure per plan (backend/, frontend/, .specify/memory/)
- [ ] T002 [P] Initialize Python backend: create venv, setup pyproject.toml and requirements.txt
- [ ] T003 [P] Initialize Node.js frontend: npm init, install Vite and React
- [ ] T004 [P] Configure Python linting tools: black, flake8, mypy in backend
- [ ] T005 [P] Configure Node.js linting tools: ESLint, Prettier in frontend
- [ ] T006 [P] Setup pytest configuration in `backend/tests/conftest.py` with fixture examples
- [ ] T007 [P] Setup Vitest configuration in `frontend/vitest.config.ts`
- [ ] T008 [P] Create `.env.example` files for both backend and frontend
- [ ] T009 Create GitHub Actions CI/CD workflow for automated testing and linting
- [ ] T010 Create README.md files for backend and frontend documentation
- [ ] T011 Initialize git repository with initial commit

**Checkpoint**: Both projects are scaffolded, dependencies installed, tooling configured, and ready for foundational work

---

## Phase 2: Foundational Infrastructure (3-4 days)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation. No feature work can begin until this phase is done.

⚠️ **CRITICAL**: This phase BLOCKS all user story implementation. Do not skip any tasks here.

### Backend Foundation

- [ ] T012 Create SQLAlchemy base model and session management in `backend/src/db/base.py` and `backend/src/db/session.py`
- [ ] T013 [P] Create Pydantic base schemas and common validation in `backend/src/schemas/__init__.py`
- [ ] T014 [P] Implement global error handling middleware in `backend/src/middleware/error_handler.py`
- [ ] T015 [P] Create custom exception classes in `backend/src/utils/errors.py` (InvalidGPSData, PhotoProcessingError, ExportError, etc.)
- [ ] T016 [P] Implement geospatial utility functions in `backend/src/utils/geospatial.py` (distance calculation, bounds checking, coordinate validation)
- [ ] T017 [P] Implement file utility functions in `backend/src/utils/file_utils.py` (file scanning, path validation, hashing)
- [ ] T018 Create database initialization script in `backend/src/db/init_db.py`
- [ ] T019 Configure FastAPI application in `backend/src/app.py` with middleware, error handlers, CORS
- [ ] T020 Create API routing structure in `backend/src/api/v1/routes.py` (router aggregation)
- [ ] T021 Setup logging configuration in `backend/src/config.py`

### Frontend Foundation

- [ ] T022 [P] Create TypeScript type definitions in `frontend/src/types/index.ts` (Photo, GPSLocation, Flight, Collection, API responses)
- [ ] T023 [P] Implement API client service in `frontend/src/services/api.ts` with Axios interceptors and error handling
- [ ] T024 [P] Create global error boundary component in `frontend/src/components/Common/ErrorBoundary.tsx`
- [ ] T025 [P] Setup React Router configuration in `frontend/src/App.tsx`
- [ ] T026 [P] Create layout components (Header, Sidebar) in `frontend/src/components/Common/`
- [ ] T027 [P] Configure global CSS and styling setup in `frontend/src/styles/index.css`
- [ ] T028 Create React Query client configuration in `frontend/src/services/queryClient.ts`
- [ ] T029 Implement localStorage utilities in `frontend/src/services/storage.ts`
- [ ] T030 Setup test utilities and mocks in `frontend/tests/setup.ts`

**Checkpoint**: Foundation ready - both backend and frontend have core infrastructure. All user story work can now begin in parallel.

---

## Phase 3: User Story 1 - Import Photos and Extract GPS Metadata (Priority: P1) 🎯 MVP

**Goal**: Users can provide a folder path, system scans for photos, extracts GPS coordinates from EXIF metadata, and stores the data.

**Independent Test**: Import folder with 5-10 drone photos, verify all GPS coordinates are extracted, displayed in table, and persisted in database.

### Data Models for US1

- [ ] T031 [P] [US1] Create Photo model in `backend/src/models/photo.py` (filename, file_path, timestamp, file_size, format, collection_id)
- [ ] T032 [P] [US1] Create PhotoMetadata model in `backend/src/models/photo.py` (latitude, longitude, altitude, camera_model, iso, shutter_speed, aperture, photo_id FK)
- [ ] T033 [P] [US1] Create Collection model in `backend/src/models/collection.py` (name, description, created_at, total_photos)
- [ ] T034 Create database migrations for Photo, PhotoMetadata, Collection tables

### Tests for US1 (Test-First)

- [ ] T035 [P] [US1] Write contract test for `/api/v1/collections` POST endpoint in `backend/tests/contract/test_collections.py` - MUST FAIL
- [ ] T036 [P] [US1] Write contract test for `/api/v1/photos/import` POST endpoint in `backend/tests/contract/test_photos.py` - MUST FAIL
- [ ] T037 [P] [US1] Write unit test for EXIF extraction in `backend/tests/unit/test_gps_extractor.py` - MUST FAIL
- [ ] T038 [P] [US1] Write unit test for file scanning in `backend/tests/unit/test_photo_processor.py` - MUST FAIL
- [ ] T039 [US1] Write integration test for import workflow (folder → extract → store) in `backend/tests/integration/test_import_workflow.py` - MUST FAIL

### Backend Implementation for US1

- [ ] T040 [P] [US1] Implement GPS extractor service in `backend/src/services/gps_extractor.py` (extract_from_photo, normalize_coordinates, validate_gps_data)
- [ ] T041 [P] [US1] Implement photo processor service in `backend/src/services/photo_processor.py` (scan_folder, process_photos, create_photo_records)
- [ ] T042 [P] [US1] Implement collection manager service in `backend/src/services/collection_manager.py` (create_collection, get_collection, list_collections)
- [ ] T043 [US1] Create collection endpoints in `backend/src/api/v1/collections.py` (POST /collections, GET /collections, GET /collections/{id})
- [ ] T044 [US1] Create photo endpoints in `backend/src/api/v1/photos.py` (POST /photos/import, GET /photos, GET /photos/{id})
- [ ] T045 [US1] Add input validation for folder paths and collection names in `backend/src/utils/validators.py`
- [ ] T046 [US1] Add error handling for corrupted EXIF, invalid GPS data, missing files
- [ ] T047 [US1] Add logging for import operations in services

### Frontend Implementation for US1

- [ ] T048 [P] [US1] Create FolderSelector component in `frontend/src/components/PhotoImport/FolderSelector.tsx`
- [ ] T049 [P] [US1] Create ImportProgress component in `frontend/src/components/PhotoImport/ImportProgress.tsx`
- [ ] T050 [P] [US1] Create ImportSummary component in `frontend/src/components/PhotoImport/ImportSummary.tsx`
- [ ] T051 [P] [US1] Create PhotoList component in `frontend/src/components/PhotoList/PhotoGrid.tsx`
- [ ] T052 [P] [US1] Create PhotoCard component in `frontend/src/components/PhotoList/PhotoCard.tsx`
- [ ] T053 [US1] Create usePhotos hook in `frontend/src/hooks/usePhotos.ts` (query photos, import photos mutation)
- [ ] T054 [US1] Create useCollections hook in `frontend/src/hooks/useCollections.ts` (create, get, list collections)
- [ ] T055 [US1] Create Dashboard page in `frontend/src/pages/Dashboard.tsx` with import and list UI
- [ ] T056 [US1] Add error messages and validation feedback in UI

### Tests for US1 Frontend

- [ ] T057 [P] [US1] Write component test for FolderSelector in `frontend/tests/unit/components/PhotoImport/FolderSelector.test.tsx`
- [ ] T058 [P] [US1] Write component test for PhotoCard in `frontend/tests/unit/components/PhotoList/PhotoCard.test.tsx`
- [ ] T059 [US1] Write integration test for import workflow in `frontend/tests/integration/import-workflow.test.tsx`

**Checkpoint**: User Story 1 is complete and independently testable. A user can import a folder of photos and see extracted GPS data in a list.

---

## Phase 4: User Story 2 - Display Photos on Interactive Map (Priority: P1) 🎯 MVP

**Goal**: Display extracted photo locations as interactive markers on a web-based map with photo details on click.

**Independent Test**: Import photos from US1, verify all GPS coordinates appear as markers on Leaflet map, click marker shows photo filename and coordinates.

### Data Models for US2

- [ ] T060 [P] [US2] Create GPSLocation model in `backend/src/models/gps_location.py` (latitude, longitude, altitude, uncertainty_radius)
- [ ] T061 [P] [US2] Create PhotoMarker model in `backend/src/models/photo_marker.py` (location_id FK, photos_count, is_clustered, visible)

### Tests for US2 (Test-First)

- [ ] T062 [P] [US2] Write contract test for `/api/v1/locations` GET endpoint in `backend/tests/contract/test_locations.py` - MUST FAIL
- [ ] T063 [US2] Write integration test for fetching locations for map display in `backend/tests/integration/test_map_display.py` - MUST FAIL

### Backend Implementation for US2

- [ ] T064 [US2] Create location endpoints in `backend/src/api/v1/locations.py` (GET /locations, GET /locations/bounds to get map extent)
- [ ] T065 [US2] Implement location service to query GPS data for map display in `backend/src/services/location_service.py`
- [ ] T066 [US2] Add location clustering logic for performance (server-side or client-side decision) in `backend/src/utils/clustering.py`
- [ ] T067 [US2] Add logging and error handling for location queries

### Frontend Implementation for US2

- [ ] T068 [P] [US2] Create MapContainer component in `frontend/src/components/Map/MapContainer.tsx` using Leaflet
- [ ] T069 [P] [US2] Create MapMarkers component in `frontend/src/components/Map/MapMarkers.tsx` for marker rendering
- [ ] T070 [P] [US2] Create MarkerPopup component in `frontend/src/components/Map/MarkerPopup.tsx` for displaying photo details
- [ ] T071 [P] [US2] Create MapControls component in `frontend/src/components/Map/MapControls.tsx` (zoom, pan buttons)
- [ ] T072 [US2] Create useMap hook in `frontend/src/hooks/useMap.ts` (manage map state, bounds, center)
- [ ] T073 [US2] Integrate map into Dashboard page
- [ ] T074 [US2] Implement error handling for map library failures (graceful fallback to table view)

### Tests for US2 Frontend

- [ ] T075 [P] [US2] Write component test for MapContainer in `frontend/tests/unit/components/Map/MapContainer.test.tsx`
- [ ] T076 [P] [US2] Write component test for MarkerPopup in `frontend/tests/unit/components/Map/MarkerPopup.test.tsx`
- [ ] T077 [US2] Write E2E test for map marker interaction in `frontend/tests/e2e/marker-interaction.spec.ts`

**Checkpoint**: User Stories 1 AND 2 are complete. Users can import photos and see them visualized on an interactive map. Core MVP is functional.

---

## Phase 5: User Story 3 - Browse and Filter Photos by Location (Priority: P2)

**Goal**: Users can filter photos by date range and geographic bounding box with real-time map updates.

**Independent Test**: Import photos from multiple dates and locations, filter by date range, verify only matching photos appear on map, then filter by bounding box.

### Tests for US3 (Test-First)

- [ ] T078 [P] [US3] Write contract test for `/api/v1/photos/filter` POST endpoint in `backend/tests/contract/test_photos.py` - MUST FAIL
- [ ] T079 [US3] Write unit test for date range filtering in `backend/tests/unit/test_filters.py` - MUST FAIL
- [ ] T080 [US3] Write unit test for bounding box filtering in `backend/tests/unit/test_filters.py` - MUST FAIL

### Backend Implementation for US3

- [ ] T081 [P] [US3] Create filter utilities in `backend/src/utils/filters.py` (filter_by_date_range, filter_by_bounds, apply_filters)
- [ ] T082 [US3] Add filter endpoint in `backend/src/api/v1/photos.py` (POST /photos/filter with date_start, date_end, bounds)
- [ ] T083 [US3] Implement filtered location query in location service
- [ ] T084 [US3] Add logging for filter operations

### Frontend Implementation for US3

- [ ] T085 [P] [US3] Create DateRangeFilter component in `frontend/src/components/Filters/DateRangeFilter.tsx`
- [ ] T086 [P] [US3] Create BoundingBoxFilter component in `frontend/src/components/Filters/BoundingBoxFilter.tsx` (interactive box drawing on map)
- [ ] T087 [P] [US3] Create FilterPanel component in `frontend/src/components/Filters/FilterPanel.tsx` combining filters
- [ ] T088 [US3] Create useFilters hook in `frontend/src/hooks/useFilters.ts` (manage filter state, apply filters)
- [ ] T089 [US3] Integrate FilterPanel into Dashboard
- [ ] T090 [US3] Implement real-time map updates when filters change
- [ ] T091 [US3] Add filter reset functionality

### Tests for US3 Frontend

- [ ] T092 [P] [US3] Write component test for DateRangeFilter in `frontend/tests/unit/components/Filters/DateRangeFilter.test.tsx`
- [ ] T093 [P] [US3] Write component test for BoundingBoxFilter in `frontend/tests/unit/components/Filters/BoundingBoxFilter.test.tsx`
- [ ] T094 [US3] Write integration test for filter workflow in `frontend/tests/integration/filter-workflow.test.tsx`

**Checkpoint**: User Story 3 is complete. Users can filter photos by date and location with real-time visualization.

---

## Phase 6: User Story 4 - Export and Share Flight Data (Priority: P2)

**Goal**: Users can export filtered photos and GPS data in GeoJSON, CSV, and KML formats for sharing and external analysis.

**Independent Test**: Create a collection, filter some photos, export to GeoJSON/CSV/KML, open exported files and verify content validity.

### Tests for US4 (Test-First)

- [ ] T095 [P] [US4] Write contract test for `/api/v1/exports` POST endpoint in `backend/tests/contract/test_exports.py` - MUST FAIL
- [ ] T096 [P] [US4] Write unit test for GeoJSON export in `backend/tests/unit/test_export_service.py` - MUST FAIL
- [ ] T097 [P] [US4] Write unit test for CSV export in `backend/tests/unit/test_export_service.py` - MUST FAIL
- [ ] T098 [P] [US4] Write unit test for KML export in `backend/tests/unit/test_export_service.py` - MUST FAIL

### Backend Implementation for US4

- [ ] T099 [P] [US4] Implement export service in `backend/src/services/export_service.py` with methods for each format
- [ ] T100 [P] [US4] Implement GeoJSON exporter in `backend/src/services/export_service.py` (export_to_geojson)
- [ ] T101 [P] [US4] Implement CSV exporter in `backend/src/services/export_service.py` (export_to_csv)
- [ ] T102 [P] [US4] Implement KML exporter in `backend/src/services/export_service.py` (export_to_kml)
- [ ] T103 [US4] Create export endpoint in `backend/src/api/v1/exports.py` (POST /exports with format, photo_ids or filter criteria)
- [ ] T104 [US4] Add file download response handling
- [ ] T105 [US4] Add export validation and error handling
- [ ] T106 [US4] Add logging for export operations

### Frontend Implementation for US4

- [ ] T107 [P] [US4] Create ExportDialog component in `frontend/src/components/Export/ExportDialog.tsx`
- [ ] T108 [P] [US4] Create ExportOptions component in `frontend/src/components/Export/ExportOptions.tsx` (format selection)
- [ ] T109 [P] [US4] Create ExportStatus component in `frontend/src/components/Export/ExportStatus.tsx` (progress/success)
- [ ] T110 [US4] Create useExport hook in `frontend/src/hooks/useExport.ts` (export mutation)
- [ ] T111 [US4] Add export button to Dashboard and integrate export UI
- [ ] T112 [US4] Implement file download functionality

### Tests for US4 Frontend

- [ ] T113 [P] [US4] Write component test for ExportDialog in `frontend/tests/unit/components/Export/ExportDialog.test.tsx`
- [ ] T114 [P] [US4] Write component test for ExportOptions in `frontend/tests/unit/components/Export/ExportOptions.test.tsx`
- [ ] T115 [US4] Write integration test for export workflow in `frontend/tests/integration/export-workflow.test.tsx`

**Checkpoint**: User Story 4 is complete. Users can export photo collections in multiple formats.

---

## Phase 7: User Story 5 - Visualize Flight Path and Statistics (Priority: P3)

**Goal**: Display flight path as a polyline on map and show flight statistics (distance, duration, altitude).

**Independent Test**: Import chronologically ordered photos, verify flight path line connects locations, verify statistics panel shows reasonable values.

### Data Models for US5

- [ ] T116 [P] [US5] Create Flight model in `backend/src/models/flight.py` (name, start_time, end_time, total_distance, max_altitude, avg_altitude, waypoints, collection_id)

### Tests for US5 (Test-First)

- [ ] T117 [P] [US5] Write unit test for flight path calculation in `backend/tests/unit/test_flight_analyzer.py` - MUST FAIL
- [ ] T118 [P] [US5] Write unit test for distance calculation in `backend/tests/unit/test_geospatial_utils.py` - MUST FAIL
- [ ] T119 [US5] Write integration test for flight analysis in `backend/tests/integration/test_flight_calculation.py` - MUST FAIL

### Backend Implementation for US5

- [ ] T120 [P] [US5] Implement flight analyzer service in `backend/src/services/flight_analyzer.py` (analyze_photos, calculate_flight_path, compute_statistics)
- [ ] T121 [P] [US5] Implement distance calculation functions in `backend/src/utils/geospatial.py` (haversine_distance, total_distance_traveled)
- [ ] T122 [US5] Create flight endpoints in `backend/src/api/v1/flights.py` (GET /flights, GET /flights/{id}, GET /flights/{id}/path, GET /flights/{id}/statistics)
- [ ] T123 [US5] Add flight analysis to photo import workflow (auto-detect flights from timestamps)
- [ ] T124 [US5] Add logging for flight calculations

### Frontend Implementation for US5

- [ ] T125 [P] [US5] Create FlightPath component in `frontend/src/components/FlightStats/FlightPath.tsx` (render polyline on map)
- [ ] T126 [P] [US5] Create StatsPanel component in `frontend/src/components/FlightStats/StatsPanel.tsx` (display statistics)
- [ ] T127 [P] [US5] Create StatCard component in `frontend/src/components/FlightStats/StatCard.tsx` (individual stat display)
- [ ] T128 [US5] Create useFlights hook in `frontend/src/hooks/useFlights.ts`
- [ ] T129 [US5] Integrate flight path visualization into map
- [ ] T130 [US5] Integrate statistics panel into Dashboard
- [ ] T131 [US5] Add flight selection/filtering UI

### Tests for US5 Frontend

- [ ] T132 [P] [US5] Write component test for FlightPath in `frontend/tests/unit/components/FlightStats/FlightPath.test.tsx`
- [ ] T133 [P] [US5] Write component test for StatsPanel in `frontend/tests/unit/components/FlightStats/StatsPanel.test.tsx`
- [ ] T134 [US5] Write E2E test for flight visualization in `frontend/tests/e2e/flight-visualization.spec.ts`

**Checkpoint**: User Story 5 is complete. All P1, P2, and P3 features are implemented.

---

## Phase 8: Cross-Cutting Concerns & Enhancements (2-3 days)

**Purpose**: Improvements affecting multiple user stories, performance optimization, and quality improvements

### Code Quality & Testing

- [ ] T135 [P] Run full test suite and achieve >80% coverage for both backend and frontend
- [ ] T136 [P] Add missing unit tests for edge cases and error scenarios
- [ ] T137 Add performance tests for GPS extraction (<10s for 1000 photos)
- [ ] T138 Add performance tests for map rendering (<100ms pan/zoom response)
- [ ] T139 Setup code coverage reporting and CI/CD integration

### Accessibility & UX

- [ ] T140 [P] Add keyboard navigation support to all interactive components
- [ ] T141 [P] Add ARIA labels and semantic HTML throughout frontend
- [ ] T142 [P] Test accessibility with screen readers (WCAG 2.1 Level AA)
- [ ] T143 Add loading spinners for async operations
- [ ] T144 Add comprehensive error messages and user guidance
- [ ] T145 Add success notifications and feedback messages

### Responsive Design

- [ ] T146 [P] Test and fix responsive design on tablets (iPad 768px+)
- [ ] T147 [P] Test and fix responsive design on mobile (fallback graceful degradation)
- [ ] T148 Add mobile-specific UI considerations (touch targets, viewport)

### Performance Optimization

- [ ] T149 Implement marker clustering for large photo collections
- [ ] T150 Optimize map tile loading and caching
- [ ] T151 Implement pagination for photo lists (lazy loading)
- [ ] T152 Optimize database queries with indexes on GPS coordinates and timestamps
- [ ] T153 Implement frontend code splitting and lazy loading for routes
- [ ] T154 Profile and optimize memory usage for large collections

### Security & Validation

- [ ] T155 [P] Add comprehensive input validation on all endpoints
- [ ] T156 [P] Add path traversal protection in file operations
- [ ] T157 [P] Validate all file uploads and MIME types
- [ ] T158 Review and harden error messages (no sensitive information leaks)
- [ ] T159 Add rate limiting for import operations
- [ ] T160 Security audit for file system access restrictions

### Documentation & Examples

- [ ] T161 Complete API documentation with examples in FastAPI auto-docs
- [ ] T162 Write deployment guide for production setup
- [ ] T163 Create user documentation with screenshots
- [ ] T164 Record demo video showing full workflow
- [ ] T165 Write architecture documentation explaining design decisions
- [ ] T166 Create developer guide for contributing to project
- [ ] T167 Validate all documentation against quickstart.md checklist

### Testing Across Browsers

- [ ] T168 [P] Test Chrome latest version
- [ ] T169 [P] Test Firefox latest version
- [ ] T170 [P] Test Safari latest version
- [ ] T171 [P] Test Edge latest version
- [ ] T172 Document any browser-specific issues and workarounds

### Final Integration & Polish

- [ ] T173 End-to-end workflow testing (import → view → filter → export)
- [ ] T174 Load testing with 10,000 photos to verify performance targets
- [ ] T175 Test edge cases (empty folders, corrupted files, invalid GPS, duplicate imports)
- [ ] T176 Code cleanup and refactoring based on learnings
- [ ] T177 Final code review and quality gate verification
- [ ] T178 Prepare release notes and version bumps

**Checkpoint**: Application is production-ready, fully tested, documented, and optimized.

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Status |
|-------|-----------|--------|
| Phase 1: Setup | None | Can start immediately |
| Phase 2: Foundation | Phase 1 complete | BLOCKS all feature work |
| Phase 3: US1 (P1) | Phase 2 complete | Can run after foundation |
| Phase 4: US2 (P1) | Phase 2 complete | Can run parallel with US1 or after |
| Phase 5: US3 (P2) | Phase 2 complete, US1+US2 working | Can run parallel or sequential |
| Phase 6: US4 (P2) | Phase 2 complete, US1 working | Can run parallel with other stories |
| Phase 7: US5 (P3) | Phase 2 complete, US1 working | Can run parallel with other stories |
| Phase 8: Polish | All feature phases complete | Final optimization pass |

### User Story Independence

- **US1 (Import & Extract)**: No dependencies on other stories
- **US2 (Map Display)**: Depends on US1 data but can be implemented in parallel
- **US3 (Filtering)**: Can be developed parallel to US1/US2, integrates with both
- **US4 (Export)**: Can be developed parallel to other stories, depends on US1 data
- **US5 (Flight Path)**: Can be developed parallel to other stories, depends on US1 data

### Optimal Parallel Execution (with 5 developers)

```bash
Days 1-3:    Phase 1 Setup (Team)
Days 3-7:    Phase 2 Foundation (Team)
Day 8:       [US1] Dev A starts, [US2] Dev B starts, [US3] Dev C starts
Day 9-12:    [US1] Dev A, [US2] Dev B, [US3] Dev C, [US4] Dev D, [US5] Dev E (all in parallel)
Day 13-14:   Integration and cross-story testing
Day 15-18:   Phase 8 Polish, optimization, documentation, final testing
```

### Sequential Execution (single developer)

```bash
Days 1-3:    Phase 1 Setup
Days 3-7:    Phase 2 Foundation
Days 8-10:   Phase 3 US1 (MVP)
Days 11-12:  Phase 4 US2 (MVP complete, demo ready)
Days 13:     Phase 5 US3 (filtering)
Days 14:     Phase 6 US4 (export)
Days 15:     Phase 7 US5 (flight stats)
Days 16-18:  Phase 8 Polish and documentation
```

### MVP Checkpoint (Minimum Viable Product)

After **Phase 4 complete** (Days 1-12 for single dev, Days 1-8 for parallel):

- Users can import photos from a folder ✅
- System extracts GPS metadata ✅
- GPS data is displayed on an interactive map ✅
- Users can see photo details by clicking markers ✅

**This is a complete, deliverable MVP. Can be released and demoed.**

---

## Parallel Opportunities Within Phases

### Phase 1 Setup Tasks

Tasks T001-T008 are all marked [P] - can run in parallel (different files):

- T001: Create directory structure
- T002: Setup Python backend
- T003: Setup Node frontend
- T004: Python linting
- T005: Node linting
- T006: Backend testing config
- T007: Frontend testing config
- T008: Environment files

### Phase 2 Foundation Tasks

Multiple [P] tasks can run in parallel:

**Backend parallel**:

- T012, T013, T014, T015, T016, T017 (different files)

**Frontend parallel**:

- T022, T023, T024, T025, T026, T027 (different files)

Backend & Frontend can work simultaneously

### Within Each User Story

**Tests can be written in parallel** (all marked [P]):

- Each test file is independent
- All contract tests together
- All unit tests together

**Models can be created in parallel** (if marked [P]):

- Each model file is independent

**Components can be built in parallel** (all marked [P]):

- Different React components
- Different API endpoints

---

## Key Milestones & Quality Gates

### After Phase 2 (Foundation Complete)

- ✅ All infrastructure in place
- ✅ Backend and frontend scaffold complete
- ✅ Database schema ready
- ✅ CI/CD pipeline functional
- ✅ Ready to begin feature development

### After Phase 3 (US1 Complete)

- ✅ Can import photos and extract GPS
- ✅ Data persists in database
- ✅ API endpoints functional
- ✅ Frontend UI for import operational
- ✅ Tests passing for US1

### After Phase 4 (MVP Complete)

- ✅ Photos visualized on map
- ✅ Map markers clickable with details
- ✅ Complete import-to-view workflow
- ✅ **MVP ready for demo/release**
- ✅ Tests passing for US1 and US2

### After Phase 7 (All Features Complete)

- ✅ All user stories P1, P2, P3 implemented
- ✅ Filtering working
- ✅ Export in multiple formats
- ✅ Flight path visualization
- ✅ Flight statistics calculated
- ✅ All feature tests passing

### After Phase 8 (Production Ready)

- ✅ Code coverage >80% for all code
- ✅ All edge cases handled
- ✅ Performance targets met
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Cross-browser tested
- ✅ Security audit passed
- ✅ Documentation complete
- ✅ Ready for production deployment

---

## Test Execution Strategy

### Test-First (TDD) Approach

1. **Write tests first** - Each task with test includes "MUST FAIL" requirement
2. **Run tests** - Verify they fail as expected (Red phase)
3. **Implement** - Write code to make tests pass (Green phase)
4. **Refactor** - Clean up code while keeping tests passing (Refactor phase)
5. **Verify coverage** - Ensure tests cover the functionality

### Continuous Testing

- Run tests locally before committing
- CI/CD pipeline runs all tests on every PR
- Maintain >80% coverage throughout development
- Performance tests run before merging performance-critical code

### Test Organization

```text
backend/tests/
├── unit/              # Tests for individual functions/classes
├── integration/       # Tests for workflows combining multiple components
├── contract/          # Tests for API contracts and endpoints
└── fixtures/          # Shared test data and mocks

frontend/tests/
├── unit/             # Component tests
├── integration/      # Feature workflow tests
└── e2e/              # End-to-end tests with full app
```

---

## Notes for Implementation

- Mark each task DONE only after tests pass and code review approved
- Commit after each logical group of tasks (usually after a complete user story)
- Use feature branches per user story (e.g., `feature/us1-import-gps`)
- Stop at any checkpoint to demo and get feedback
- If a user story becomes too complex, break into smaller subtasks
- Document any blockers or architectural decisions in ADRs
- Keep performance targets in mind during implementation
- Run full test suite before each PR submission


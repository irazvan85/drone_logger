# Drone Photo GPS Visualizer - Backend

FastAPI-based backend for GPS extraction, data processing, and API endpoints.

> **Note**: For Docker deployment, see the [root README](../README.md).

## Setup

### Prerequisites
- Python 3.11+
- pip or poetry

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# For development
pip install -r requirements-dev.txt
```

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration values

### Running Development Server

```bash
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

### Run all tests
```bash
pytest
```

### Run with coverage
```bash
pytest --cov=src --cov-report=html
```

### Run specific test suite
```bash
# Unit tests only
pytest tests/unit

# Integration tests only
pytest tests/integration

# Contract tests only
pytest tests/contract
```

## Code Quality

### Linting
```bash
flake8 src tests
```

### Type checking
```bash
mypy src
```

### Code formatting
```bash
black src tests
```

### Auto-fix imports
```bash
isort src tests
```

## Project Structure

```
backend/
├── src/
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic layer
│   ├── api/v1/          # API routes and endpoints
│   ├── db/              # Database configuration and session management
│   ├── utils/           # Utility functions
│   ├── middleware/      # FastAPI middleware
│   ├── app.py           # FastAPI application entry point
│   └── config.py        # Configuration management
├── tests/
│   ├── unit/            # Unit tests for individual functions
│   ├── integration/     # Integration tests for workflows
│   ├── contract/        # API contract tests
│   ├── fixtures/        # Shared test data
│   └── conftest.py      # Pytest configuration
├── pyproject.toml       # Project metadata and dependencies
├── requirements.txt     # Production dependencies
├── requirements-dev.txt # Development dependencies
└── .env.example         # Environment variables template
```

## Database

The application uses SQLite for local file-based storage. Database file location is configured in `.env` via `DATABASE_URL`.

### Migrations

Database migrations are managed with Alembic. To create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## API Documentation

The API follows REST conventions and is fully documented with OpenAPI/Swagger.

### Main Endpoints

- **Collections**: `/api/v1/collections` - Manage photo collections
- **Photos**: `/api/v1/photos` - Photo management and import
- **Locations**: `/api/v1/locations` - GPS location queries
- **Flights**: `/api/v1/flights` - Flight path and statistics
- **Exports**: `/api/v1/exports` - Data export in multiple formats

See API documentation at `/docs` when server is running.

## Development Workflow

1. Create a feature branch: `git checkout -b feature/us1-import-gps`
2. Implement feature with tests first (TDD)
3. Ensure tests pass: `pytest`
4. Format code: `black src tests && isort src tests`
5. Check linting: `flake8 src tests`
6. Run type checker: `mypy src`
7. Create PR with description

## Contributing

- Follow the Constitution.md principles
- Write tests first (TDD)
- Maintain >80% code coverage
- Use clear, descriptive commit messages
- Ensure all tests pass before submitting PR

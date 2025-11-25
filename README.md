# Drone Photo GPS Visualizer

A web application to visualize drone photos on a map based on their GPS metadata.

## Features

- **Import**: Scan folders for photos and extract GPS data.
- **Visualize**: View photo locations on an interactive map.
- **Filter**: Filter photos by date and map bounds.
- **Analyze**: View flight statistics and paths.
- **Export**: Export data to GeoJSON, CSV, or KML.

## Quick Start (Docker)

1.  Ensure you have Docker and Docker Compose installed.
2.  Run the application:
    ```bash
    docker-compose up --build
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Manual Setup

### Backend

1.  Navigate to `backend/`.
2.  Create a virtual environment and install dependencies:
    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    uvicorn src.app:app --reload
    ```

### Frontend

1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

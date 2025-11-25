# Backend Stage
FROM python:3.11-slim as backend

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/src ./src
COPY backend/app.py .
COPY backend/config.py .
# Copy other necessary backend files if any (e.g. alembic.ini)

# Frontend Build Stage
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Final Stage (Serving with Nginx or just Backend serving static? Plan said Nginx)
# Actually, usually we use Nginx to serve frontend and proxy /api to backend.
# But here I'll create a setup where we have two services in docker-compose, 
# so this Dockerfile might be better split. 
# However, the plan said "Create Dockerfile" (singular).
# I will create a Dockerfile that defaults to backend, but can be targeted for frontend?
# Or I can create a single image that runs both? No, that's bad practice.
# I will create a Dockerfile that has targets for both.

# Target: Backend
FROM backend as backend-service
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]

# Target: Frontend (Nginx)
FROM nginx:alpine as frontend-service
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

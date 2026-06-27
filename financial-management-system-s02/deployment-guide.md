# Deployment Guide

## Frontend on Vercel

- Set the project root to `frontend`.
- Add environment variable `VITE_API_BASE_URL` with the Render backend URL.
- Build command: `npm run build`.
- Output directory: `dist`.

## Backend on Render

- Set the project root to `backend`.
- Build command: `mvn -q -DskipTests package`.
- Start command: `java -jar target/financeflow-backend-1.0.0.jar`.
- Add environment variables for MySQL, JWT secret, and CORS origins.

## Railway MySQL

- Provision a MySQL 8 database.
- Copy the Railway JDBC URL, username, and password into the Render environment.
- Update `SPRING_DATASOURCE_URL` to the Railway JDBC connection string.

## Production Checklist

- Replace the default JWT secret.
- Set `CORS_ALLOWED_ORIGINS` to the deployed frontend domain.
- Verify seeded users on first startup.
- Confirm `/swagger-ui.html` and `/actuator/health` respond in production.

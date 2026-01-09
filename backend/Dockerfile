FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

# Install curl for health-check
RUN apt install curl -y

# Install uv
RUN pip install --no-cache-dir uv

# Copy dependency files
COPY pyproject.toml ./
COPY alembic.ini ./

# Install dependencies (will create lock file if needed)
RUN uv sync --no-dev

# Copy application code
COPY alembic ./alembic
COPY app ./app

# Create entrypoint script
RUN cat > /app/entrypoint.sh <<'EOF'
#!/bin/bash
set -e

echo "Waiting for database..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"
echo "Running migrations..."
uv run alembic upgrade head

echo "Starting application..."
exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
EOF

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl --fail http://localhost:8000/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]

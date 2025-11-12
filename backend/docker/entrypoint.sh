# backend/docker/entrypoint.sh
set -euo pipefail

# Run DB migrations if env is present
if [ -n "${DATABASE_URL:-}" ]; then
  echo "Running Alembic migrations..."
  alembic upgrade head
fi

# Start API
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

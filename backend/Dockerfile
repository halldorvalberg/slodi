

# How to build & run (example)
# Build image (run from repo root):
#   docker build -t slodi-backend:dev -f backend/Dockerfile .
#
# Run Postgres (example) and backend on a dedicated network:
#   docker network create slodi-network
#   docker run -d --name slodi-postgres --network slodi-network \
#     -e POSTGRES_DB=slodi -e POSTGRES_USER=slodi -e POSTGRES_PASSWORD=changeme \
#     -p 5432:5432 postgres:15
#
# Run backend and pass sensitive config via env (do NOT bake into Dockerfile):
#   docker run --rm -it \
#     --name slodi-backend \
#     --network slodi-network \
#     -p 8000:8000 \
#     -e DB_HOST=slodi-postgres \
#     -e DB_PORT=5432 \
#     -e DB_NAME=slodi \
#     -e DB_USER=slodi \
#     -e DB_PASSWORD=changeme \
#     -e LOGGER_LEVEL=INFO \
#     -e BUILD_ENV=production \
#     slodi-backend:dev

FROM python:3.12

# Set working directory
WORKDIR /app

# TOML file for dependencies
COPY ./pyproject.toml ./pyproject.toml
COPY ./alembic.ini ./alembic.ini
COPY ./alembic ./alembic

# Install dependencies
RUN pip install --upgrade pip \
    && pip install uv \
    && uv sync

# Copy application code
COPY ./app ./app

# NOTE: Do NOT bake sensitive credentials into the image. Pass runtime
# configuration via `docker run -e VAR=value` or a secrets/compose file.
# The environment variables the application reads include (examples):
#   BUILD_ENV, LOGGER_LEVEL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
#   TEST_DB_HOST, TEST_DB_PORT, TEST_DB_NAME, TEST_DB_USER, TEST_DB_PASSWORD

## NOTE: Migrations run during build can fail if the database is not reachable.
## Consider running migrations at runtime or via an entrypoint script.
RUN uv run alembic upgrade head || true

# Expose the port the app runs on (uvicorn listens on 8000)
CMD ["uvicorn", "code.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
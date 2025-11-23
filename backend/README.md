# Slóði Backend
Modern FastAPI + SQLAlchemy + Pydantic backend with PostgreSQL, Alembic migrations, and a full test suite.

## 🚀 Tech Stack
- **Python** ≥ 3.10
- **FastAPI** — API framework
- **SQLAlchemy 2.0** — ORM (async + psycopg3 driver)
- **Pydantic v2** — schema validation
- **PostgreSQL 14+** — database
- **Alembic** — database migrations
- **pytest + pytest-asyncio** — testing
- **uv** — dependency and environment manager

## 📂 Project Layout
```
backend/
├── app/
│   ├── __init__.py
│   ├── core/          # DB engine, settings, dependencies
│   ├── models/        # SQLAlchemy ORM models
│   ├── schemas/       # Pydantic DTOs
│   └── utils/         # shared utilities
│
├── tests/             # pytest tests (unit + integration)
├── alembic/           # migrations (env.py, versions/)
├── alembic.ini
├── pyproject.toml
└── Makefile
```

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
    git clone git@github.com:halldorvalberg/slodi.git
    cd slodi/backend
    ```

2. **Install dependencies:**
    ```bash
    uv sync --group dev
    ```

3. **Set up environment variables:**
    Create a `.env` file in the `backend/` directory based on the `.env.example` template.

## 🗄️ Database Migrations (Alembic)

**Create new migration:**
When you modify models, create a new migration with:
   ```bash
   uv run alembic revision --autogenerate -m "your message"
   ```  

**Apply migrations:**
   ```bash
   uv run alembic upgrade head
   ```


**Downgrade database:**
   ```bash
   uv run alembic downgrade -1
   ```

## 🧪 Testing

We use pytest with async SQLAlchemy.
Note: Tests should never run against a production database!

**Run all tests:**
   ```bash
   make test
   ```

## 🔑 Conventions

- **Models** (`app/models`): SQLAlchemy 2.0, joined-table inheritance for `Content → Program|Event|Task`.
    - Only `id` has ORM-level defaults (`uuid4`).
    - Business defaults live in **schemas**.
    - Relationships use `foreign_keys` + `primaryjoin` when multiple FK paths exist.

- **Schemas** (`app/schemas`): Pydantic v2.
    - Enforce lengths (`StringConstraints`).
    - Lowercase + normalize emails.
    - Supply defaults (e.g. `Workspace.default_interval=weekly`).
    - Validation (e.g. `Task.participant_max >= participant_min`).

- **Tests** (`tests/`):
    - Unit tests check schema validation.
    - Integration tests insert models into Postgres and verify relationships & cascades.
    - Optionally skip integration tests if DB not available.

- **Migrations**: All schema changes go through Alembic, never manual `DROP/CREATE`.

## 🛠️ Dev Commands

Makefile in project root:

```Makefile
test:
	PYTHONPATH=. uv run pytest -q

lint:
	uv run ruff check .

fmt:
	uv run ruff format .

makemigration:
	uv run alembic revision --autogenerate -m "$(m)"

migrate:
	uv run alembic upgrade head

downgrade:
    uv run alembic downgrade -1
```

Usage:
```bash
make test
make lint
make fmt
make makemigration m="add user table"
make migrate
```
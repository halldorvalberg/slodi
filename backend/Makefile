.PHONY: test lint fmt migrate makemigration downgrade

# Defaults — can be overridden on the `make` command line, e.g.
# `make run HOST=0.0.0.0` or `make run ARGS="--host 0.0.0.0 --port 8000"`
HOST ?= 127.0.0.1
PORT ?= 8000
ARGS ?=

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

run:
	@if [ -n "$(ARGS)" ]; then \
		PYTHONPATH=. uv run uvicorn app.main:app --reload $(ARGS); \
	else \
		PYTHONPATH=. uv run uvicorn app.main:app --reload --host $(HOST) --port $(PORT); \
	fi


# Example usage:
# make makemigration m="add new field to user"
# make migrate

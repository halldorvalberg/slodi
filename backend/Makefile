.PHONY: test lint fmt migrate makemigration downgrade

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
	PYTHONPATH=. uv run uvicorn app.main:app --reload


# Example usage:
# make makemigration m="add new field to user"
# make migrate

# xprez-crm.api

FastAPI backend service powering the xPrezideas CRM platform. The project ships with a minimal health endpoint and a structure that is ready to grow with more domain-specific features.

## Requirements

- Python 3.10+
- `pip` (or your preferred package manager)

## Getting Started

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. (Optional) Copy `.env.example` to `.env` and adjust the connection string if you are not using the default PostgreSQL credentials.

   ```bash
   cp .env.example .env
   ```

3. Install dependencies for local development:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the API with reload enabled for local development:
   ```bash
   uvicorn app.main:app --reload
   ```
5. Visit `http://127.0.0.1:8000/` (redirects) or `http://127.0.0.1:8000/api/v1/docs` for the interactive Swagger UI.

## Configuration

Application settings are managed with Pydantic settings. Override defaults by creating a `.env` file in the project root. Available variables:

- `PROJECT_NAME` – Custom display name for the API (default: `xPrezideas CRM API`)
- `VERSION` – API version string (default: `0.1.0`)
- `API_V1_PREFIX` – Base path for versioned routes (default: `/api/v1`)
- `ENVIRONMENT` – Environment label, e.g., `development`, `staging`, or `production`
- `DATABASE_URL` – SQLAlchemy URL for your database (default: `postgresql+psycopg://postgres:postgres@localhost:5432/xprezideas_crm`)
- `DATABASE_ECHO` – Set to `true` to echo SQL statements in logs

## Database

The service uses SQLAlchemy 2.0 models and sessions. To bootstrap a new environment:

```bash
python -m scripts.migrate
```

The API also runs this check on startup and will create the schema automatically when the tables are missing or empty. For production deployments prefer migrations (e.g., Alembic).

## Migrations

Alembic is bundled for schema migrations. Typical workflow:

```bash
# Create a new revision (edit the generated file in migrations/versions/)
alembic revision -m "short description"

# Apply migrations
alembic upgrade head

# (Optional) roll back the most recent migration
alembic downgrade -1
```

The Alembic environment pulls the database URL from `app.core.config.settings`, so ensure your `.env` is configured before running these commands.

## Tests

Run the test suite with:

```bash
pytest
```

## Project Structure

- `app/` – FastAPI application modules (API routers, config, schemas, models, data helpers)
- `tests/` – Automated tests
- `pyproject.toml` – Project metadata and dependencies

Extend the `app/` package with additional routers, models, and services as your CRM feature set evolves.



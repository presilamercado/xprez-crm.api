"""Run database migrations from the command line."""

from app.core.migrate import run_migrations_if_needed


def main() -> None:
    executed = run_migrations_if_needed()
    if executed:
        print("Database schema ensured.")
    else:
        print("Database already initialized; no action taken.")


if __name__ == "__main__":
    main()

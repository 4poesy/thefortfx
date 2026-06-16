# TheFortFX Backend

Production-grade FastAPI backend for the *TheFortFX* AI-powered forex intelligence SaaS platform. The application provides signals, forecasts, sentiment tracking, economic calendars, risk calculation tools, trade journaling, and Stripe billing.

## Technology Stack

- **Core Framework**: FastAPI (Python 3.12)
- **Database**: Supabase / PostgreSQL via SQLAlchemy 2.0 Async Session
- **Caching & Rate Limiting**: Redis JSON client
- **Job Orchestration**: Celery (with Redis broker & beat scheduler)
- **Security**: Supabase JWT authentication (HS256)
- **Payments**: Stripe Checkout & Portal webhooks
- **AI Integrations**: Anthropic Claude (Pro/Agency) & Google Gemini (Free)
- **Email**: Resend SDK
- **Logging**: structlog JSON logs

---

## Directory Structure

```
thefortfx-backend/
├── alembic/                # Alembic database migrations
├── app/
│   ├── api/v1/             # REST API routes / sub-routers
│   ├── calculators/        # Pure mathematical calculator scripts
│   ├── core/               # DB, Redis, security, middleware configurations
│   ├── jobs/               # Celery worker task definitions
│   ├── models/             # SQLAlchemy 2.0 async ORM models
│   ├── notifications/      # Dispatch channels (Email, Telegram, Webhooks)
│   ├── repositories/       # Generic and specialized SQL CRUD layer
│   ├── schemas/            # Pydantic v2 validation models
│   ├── services/           # Business logic & AI orchestration layer
│   ├── config.py           # Settings loader
│   ├── dependencies.py     # FastAPI dependency injections
│   └── main.py             # App instantiation & middleware loader
├── docker/                 # Container files & Docker Compose config
├── scripts/                # Seeding and administration scripts
└── tests/                  # Pytest unit and integration test suite
```

---

## Getting Started

### 1. Requirements

- Python 3.12+
- Redis Server
- PostgreSQL (or Supabase project)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/4poesy/thefortfx.git
cd thefortfx/thefortfx-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Key configuration variables:
- `DATABASE_URL`: PostgreSQL connection string (use `postgresql+asyncpg://`)
- `REDIS_URL`: Redis connection string (e.g. `redis://localhost:6379/0`)
- `SUPABASE_JWT_SECRET`: HS256 secret key from Supabase API settings
- `STRIPE_SECRET_KEY`: Stripe API keys for billing checks

---

## Run Development Servers

### 1. Database Migrations & Seeding

```bash
# Run migrations to update database schema
alembic upgrade head

# Seed currency pairs
python scripts/seed_pairs.py

# Seed broker reviews
python scripts/seed_brokers.py
```

### 2. Start FastAPI Server

```bash
uvicorn app.main:app --reload --port 8000
```
Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the interactive OpenAPI documentation.

### 3. Start Celery Worker & Beat (Background Jobs)

```bash
# Run Celery worker
celery -A app.jobs.celery_app worker --loglevel=info

# Run Celery beat (periodic scheduler)
celery -A app.jobs.celery_app beat --loglevel=info
```

---

## Container Deployment (Docker Compose)

The entire backend stack (API, Redis, Postgres, Worker, Beat scheduler) can be launched using Docker Compose:

```bash
cd docker
docker-compose up --build
```

---

## Running Tests

Execute the test suite using `pytest`:

```bash
pytest
```

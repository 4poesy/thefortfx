# Agent Handoff Guide — Developer & AI Assistant Context

This document is designed for AI coding assistants (like Gemini, Cursor, or Claude) or new developers onboarding onto the **TheFortFX** codebase. It outlines the architectural details, file mappings, patterns, and verification pipelines.

---

## 🏛️ Architecture Conventions

TheFortFX is a full-stack application structured as follows:

1. **Frontend (React)**: Built on **TanStack Start**, which combines:
   - **TanStack Router:** File-based type-safe routing.
   - **Vite:** Asset compiling and plugin orchestration.
   - **Nitro:** The server handler and deployment package.
   - **Tailwind CSS v4:** A CSS-first utility library loaded directly inside `src/styles.css`.
2. **Backend (Python)**: Production-grade **FastAPI** application:
   - **SQLAlchemy 2.0:** Async database mapping.
   - **Redis:** Caching and sliding-window rate limiting.
   - **Celery:** Asynchronous cron scrapers and ranking generators.
   - **Stripe & Supabase:** Payment and auth systems.

---

## 📂 Key Files & Where to Edit

### Frontend

| Target Area | File to Modify | Notes |
| :--- | :--- | :--- |
| **Styling & Themes** | `src/styles.css` | Edit OKLCH variables, classes, utility definitions, or animations. |
| **Global Shell** | `src/routes/__root.tsx` | Contains base HTML `<head>` assets, provider wrappers, and PWA registration hooks. |
| **Site Navigation** | `src/components/layout/Header.tsx` | Contains responsive header navbar, search links, and the dropdown menu. |
| **Watchlist & Settings** | `src/routes/dashboard.tsx` | Handles account profile updates, settings toggle states, and watchlist checklists. |

### Backend

| Target Area | Directory/File | Notes |
| :--- | :--- | :--- |
| **API Endpoints** | `thefortfx-backend/app/api/v1/` | REST route handlers (health, auth, user, signals, forecasts, etc.). |
| **Business Logic** | `thefortfx-backend/app/services/` | Business rules, weighted Opportunity Scorer, Stripe flows, AI routing. |
| **DB ORM Models** | `thefortfx-backend/app/models/` | SQLAlchemy models mapping 1:1 to Supabase tables. |
| **Celery Tasks** | `thefortfx-backend/app/jobs/` | Cron scrapers, calculations, and alert sweeps. |

---

## 🚀 Verification Workflow

### 1. Frontend Verification
- **Compilation Check:** Verify type-safety, code imports, and route trees:
  ```bash
  bun run build
  ```
- **Development Server:** Run local dev server:
  ```bash
  bun run dev
  ```

### 2. Backend Verification
- **Run Tests:** Execute pytest to verify calculator algorithms, endpoints, and validation schemas:
  ```bash
  pytest
  ```
- **Database Migrations:** Apply any database schema adjustments:
  ```bash
  alembic upgrade head
  ```
- **Development Server:** Run uvicorn server:
  ```bash
  uvicorn app.main:app --reload --port 8000
  ```

---

## 📈 Project Status Update

- **Backend Status:** 100% Complete. All SQLAlchemy ORM models, Pydantic validation schemas, business logic layers, pure calculators, background Celery tasks, and FastAPI endpoints matching the prompt specifications are implemented.
- **Test Suite:** Fully configured and verified. Both unit tests for mathematical trading formulas and API tests for the calculators pass cleanly (13 tests total).
- **SQLite vs. PostgreSQL Column Map Resolution:** Addressed the SQLAlchemy declarative reserved word conflict by renaming the Python attribute `metadata` to `meta` on the `AuditLog` model while mapping it to database column `"metadata"`.
- **Git State & Schema Setup:** Synchronized with the remote repository on `https://github.com/4poesy/thefortfx.git`. Created [supabase_schema.sql](file:///c:/Users/Akinola%20Olujobi/Documents/thefortfx/thefortfx-backend/supabase_schema.sql) which bundles the entire 17-block database structure DDL (Extensions, tables, indexes, triggers, views, and RLS policies) for copy-paste execution in the Supabase SQL Editor.

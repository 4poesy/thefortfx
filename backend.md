# TheFortFX — Backend Documentation

## Overview
TheFortFX backend is a production-grade FastAPI application powering an AI-powered forex intelligence SaaS platform. It handles trade signals, forecasts, sentiment analysis, economic calendar events, risk calculators, trade journaling, automated alert systems, subscription management, and AI analysis.

---

## Technology Stack

| Layer | Technology | Version / Specification |
| :--- | :--- | :--- |
| **Core Framework** | FastAPI | `0.111.x` |
| **Language** | Python | `3.12+` (Currently running `3.13.5` locally) |
| **Database** | PostgreSQL | Supabase v15 |
| **Auth Provider** | Supabase Auth | JWT Validation Only |
| **ORM** | SQLAlchemy | `2.0` (Async) |
| **Database Migrations** | Alembic | Latest |
| **Data Validation** | Pydantic | `v2` |
| **Cache & Session** | Redis | `7.2` (Slowapi rate limiting / caching) |
| **Task Queue** | Celery + Redis | `5.3.x` / `5.4.0` |
| **AI (Pro / Agency)** | Anthropic Claude API | `claude-sonnet-4-6` |
| **AI (Free / Starter)** | Google Gemini API | `gemini-1.5-flash` |
| **Email Service** | Resend | SDK |
| **Payments** | Stripe | SDK / Webhooks |
| **HTTP Client** | HTTPX | Async |
| **Testing** | Pytest | `pytest-asyncio` |

---

## Project Structure

```
thefortfx-backend/
├── app/
│   ├── main.py                    # FastAPI app factory
│   ├── config.py                  # Settings via pydantic-settings
│   ├── dependencies.py            # Shared FastAPI dependencies
│   ├── core/                      # Core configs (DB, Redis, Security, Exceptions, Logging)
│   ├── models/                    # SQLAlchemy ORM models (Profiles, Pairs, Signals, etc.)
│   ├── schemas/                   # Pydantic validation schemas
│   ├── repositories/              # Async database CRUD repositories
│   ├── services/                  # Business logic services (Stripe, Alerts, AI, etc.)
│   ├── api/v1/                    # API v1 routers
│   ├── jobs/                      # Celery tasks and schedules
│   ├── calculators/               # Pure mathematical calculators (Pip, Drawdown, etc.)
│   └── notifications/             # Dispatchers (Telegram, Email, Webhooks)
├── alembic/                       # Migration history
├── tests/                         # Unit & API tests
├── scripts/                       # Database seeders
└── docker/                        # Dockerfiles and docker-compose configurations
```

---

## Database Schema (Supabase / Postgres)

The backend mirrors the following tables, views, and indexes:

1. **Profiles (`profiles`)**: Links to Supabase `auth.users` with fields `role` (free, premium, agency, admin), display name, Telegram details, experience levels, and webhook secrets.
2. **Pairs (`pairs`)**: Mapped currency pairs and commodities (e.g., `EURUSD`, `XAUUSD`, `BTCUSD`).
3. **Signals (`signals`) & History (`signal_history`)**: Stores entry, stop loss, take profit targets, risk/reward pips, directions (`BUY` / `SELL` / `NEUTRAL`), and active changelogs.
4. **Forecasts (`forecasts`)**: Technical analysis trends (`Strong Bullish` to `Strong Bearish`), support/resistance levels, indicators (EMA, RSI, MACD), and timeframes (`daily`, `weekly`, `monthly`).
5. **Opportunities (`opportunities`)**: Scorecards calculated based on the Opportunity Score Engine.
6. **Sentiment (`sentiment`)**: Trackers for retail long/short ratios and institutional bias.
7. **Economic Events (`economic_events`)**: RSS-scraped calendar events with high/medium/low impact ratings.
8. **News (`news`)**: Financial headlines tagged to affected pairs.
9. **Brokers (`brokers`)**: Regulatory information, trust scores, headquarters, pros, cons, and comparisons.
10. **Watchlists (`watchlists`)**: User-configured watch lists.
11. **Alerts (`alerts`) & Deliveries (`alert_deliveries`)**: Alert settings for price and signal changes, with delivery reports.
12. **Trade Journal (`journal_entries`)**: Individual logs (entry, exit, lot sizes, commissions, win/loss status) with automatically derived performance views (`journal_performance_view`).
13. **Subscriptions (`subscriptions`)**: Subscription records mapped to Stripe checkout events.
14. **Audit Logs (`audit_logs`)**: Detailed log traces for administrator activity and updates.
15. **Views (`active_signals_view`, `top_opportunities_view`, `journal_performance_view`)**: Optimised PostgreSQL joins for fast listings.

---

## Opportunity Score Engine

The opportunity score (0-100) is calculated every 10 minutes by a Celery task using weighted indicators:
- **Trend Score** (30% weight): Driven by active signal direction & confidence.
- **Sentiment Score** (25% weight): Retail sentiment polarity dominance.
- **Consensus Score** (25% weight): Confluence of forecast trends.
- **Volatility Score** (10% weight): Inverse volatility score (calmer markets generate higher scores).
- **News Risk Score** (10% weight): Inverse high-impact economic events proximity risk.

---

## Authentication Architecture

Supabase Auth serves as the identity provider. FastAPI validates incoming JWT signatures using the public HS256 JWT key (`SUPABASE_JWT_SECRET`) and maps claims to the `Profile` model.
Role-based Access Control (RBAC) is implemented via the `require_role(...)` dependency.

---

## API Endpoints (`/api/v1`)

- **Health Checks**: `/health`, `/health/live`, `/health/ready`
- **Auth Sync**: `/auth/sync-profile`, `/auth/me`, `/auth/logout`
- **Users**: `/users/me`, `/users/me/stats`, `/users/me/subscription`
- **Pairs**: `/pairs`, `/pairs/{slug}`, `/pairs/{slug}/signal`, `/pairs/{slug}/forecast`, `/pairs/{slug}/sentiment`, `/pairs/{slug}/opportunities`
- **Signals**: `/signals`, `/signals/{slug_or_id}`, `/signals/{slug_or_id}/history` (slug or uuid routing supported)
- **Forecasts**: `/forecasts`, `/forecasts/{slug_or_id}`, `/forecasts/{slug}/{timeframe}`
- **Opportunities**: `/opportunities`, `/opportunities/top`, `/opportunities/{slug}`
- **Sentiment**: `/sentiment`, `/sentiment/{slug}`
- **Economic Calendar**: `/economic-calendar`, `/economic-calendar/today`, `/economic-calendar/upcoming`
- **News**: `/news`, `/news/{slug}`
- **Calculators**: `/calculators/pip`, `/calculators/position-size`, `/calculators/risk-reward`, `/calculators/drawdown`, `/calculators/stop-loss`, `/calculators/take-profit` (do not require auth)
- **Watchlists**: `/watchlists`, `/watchlists/{pair_slug}`
- **Alerts**: `/alerts`, `/alerts/{id}`, `/alerts/{id}/history`
- **Trade Journal**: `/journal`, `/journal/stats`, `/journal/stats/monthly`, `/journal/stats/pairs`
- **Brokers**: `/brokers`, `/brokers/top`, `/brokers/{slug}`, `/brokers/compare`
- **AI Analytics**: `/ai/analyze-trade`, `/ai/market-summary`, `/ai/pair-analysis/{slug}`
- **Stripe Subscriptions**: `/subscriptions/plans`, `/subscriptions/checkout`, `/subscriptions/portal`, `/subscriptions/webhook`
- **Admin Tools**: `/admin/users`, `/admin/users/{id}/role`, `/admin/users/{id}`, `/admin/signals`, `/admin/signals/bulk`, `/admin/analytics`, `/admin/analytics/revenue`, `/admin/broadcast`, `/admin/audit-logs`

---

## Verification & Tests

### Running Tests
Execute unit and API endpoint tests using `pytest` inside the virtual environment:
```bash
.venv\Scripts\pytest
```

### Database Schema Setup (Supabase SQL Editor)
To initialize the database, execute the unified schema DDL file directly in your Supabase project's SQL Editor:
- **SQL Script**: [supabase_schema.sql](file:///c:/Users/Akinola%20Olujobi/Documents/thefortfx/thefortfx-backend/supabase_schema.sql) (includes extensions, tables, seed data, triggers, views, and RLS policies).

### Applying Migrations (Optional)
If database migrations are managed via Alembic:
```bash
alembic upgrade head
```

### Seeding Data
Run seed files to populate major pairs and brokers (if not already seeded via SQL):
```bash
python scripts/seed_pairs.py
python scripts/seed_brokers.py
```


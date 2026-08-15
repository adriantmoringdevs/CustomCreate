# CustomCreator

A shop management app for tracking custom jobs — materials, labor, inventory, and reorder requests all in one place. Built for small fabrication/custom-work shops that need to know what a job actually cost them (materials + labor) without digging through spreadsheets.

Think: a manager creates a job for a customer, logs materials pulled from inventory and hours worked, and the app tallies up the real cost as you go. Employees can log their own hours and flag materials that need reordering.

## What it does

- **Jobs** — create/edit/delete jobs, track status (quoted → in progress → completed/cancelled) and payment status (unpaid/partially paid/paid)
- **Materials & inventory** — materials are tracked in **lots** (think: each purchase batch has its own cost and remaining quantity), so job costing uses actual cost-per-lot, not an average
- **Labor entries** — log hours + hourly rate against a job; users can only edit their own entries
- **Job costing** — each job auto-calculates `labor_cost + material_cost = total_job_cost` from its linked labor entries and material usage
- **Reorder requests** — flag materials running low so someone orders more
- **Auth & roles** — JWT-based login, two roles: `MANAGER` (full access) and `EMPLOYEE` (can log labor/hours and submit reorder requests, but can't create jobs or order materials)

## Tech stack

**Backend**
- Flask + Flask-RESTful (REST API)
- SQLAlchemy + Flask-Migrate (ORM + migrations)
- Marshmallow (serialization)
- Flask-JWT-Extended (auth)
- Flask-Bcrypt (password hashing)
- Postgres in Docker / SQLite for quick local runs

**Frontend**
- React 19 + Vite
- React Router
- MUI (Material UI) + some styled-components/emotion mixed in
- Plain CSS files per section (no Tailwind here)

## Database schema

Six core tables: `User`, `Job`, `Material`, `MaterialLot`, `JobMaterialUsage`, `LaborEntry`, and `ReorderRequest`. The lot/usage split is the key design choice — materials aren't just "in stock, X quantity," they're purchased in lots (each with its own cost), and jobs pull from specific lots so cost tracking stays accurate even when the price of a material changes between purchases.

![Database schema diagram](./docs/schema.png)


## Getting started

### Option 1: Docker (easiest)

Spins up Postgres, the Flask API, and the Vite dev server together.

```bash
docker-compose up --build
```

- API: `http://localhost:5000`
- Client: `http://localhost:5173`

### Option 2: Running it manually

**Backend**

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade   # applies migrations
python3 app.py
```

Runs on `http://localhost:5000`. By default it points at a local SQLite file (`app.db`) — no Postgres needed for local dev.

**Frontend**

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Heads up / things to know

- The Flask secret key and JWT secret in `server/config.py` are hardcoded placeholders — fine for local dev, but swap these for real env-var-based secrets before this ever sees a real deployment.
- Local dev defaults to SQLite; the Docker setup uses Postgres via `DATABASE_URL`. Worth double-checking `config.py` picks that up correctly if you're troubleshooting DB connection issues in Docker.
- CORS is currently locked to `http://localhost:5173` in `app.py` — update that if the frontend ends up served from somewhere else.

## API overview

All routes are prefixed with `/api` and (aside from login/signup) require a JWT in the `Authorization` header.

| Route | Methods | Notes |
|---|---|---|
| `/signup`, `/login` | POST | Returns a JWT + user object |
| `/me` | GET | Current user info |
| `/users` | GET | List all users |
| `/jobs` | GET, POST, PUT, DELETE | Manager-only for write ops |
| `/jobs/<id>` | GET | Single job |
| `/jobs/<id>/job_material_usages` | GET | Materials used on a job |
| `/materials` | GET, POST, PUT, DELETE | Manager-only for write ops |
| `/materials/available` | GET | Materials with stock remaining |
| `/materials/order` | POST | Order materials into general inventory |
| `/jobs/<id>/materials/order` | POST | Order materials directly for a job |
| `/jobs/<id>/materials/use` | POST | Pull from an existing material lot for a job |
| `/labor_entries` | POST, PUT, DELETE | Users can only edit/delete their own |
| `/jobs/<id>/labor_by_job` | GET | Labor entries for a job |
| `/labor_entries/<id>` | GET | Single labor entry |
| `/reorder_requests` | GET, POST, PUT, DELETE | Flag/manage low-stock materials |

## Project structure

```
CustomCreator/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # forms, tables, layout pieces
│       ├── context/         # UserContext for auth state
│       └── pages/           # Dashboard, JobList, MaterialList, etc.
├── server/                  # Flask API
│   ├── app.py                # routes/resources
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Marshmallow schemas
│   ├── config.py               # app/db/jwt config
│   └── migrations/            # Alembic migrations
└── docker-compose.yml
```

## Roles

- **MANAGER** — full access: create/edit/delete jobs and materials, order inventory, everything an employee can do
- **EMPLOYEE** — can log labor hours (their own only), use materials on a job, and submit reorder requests, but can't create jobs or place material orders

## Roadmap / not done yet

- Material detail page (route is stubbed out in `App.jsx` but not built)
- `/materials/totals` endpoint exists as a stub but isn't implemented yet

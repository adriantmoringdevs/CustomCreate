# CustomCreator — Frontend Spec & Build Plan

**Deadline:** Saturday, August 15, 2026
**Total available build time:** ~30 hours across 6 sessions
**Styling approach:** Plain CSS throughout (no MUI). Recharts optional, Phase 3+.

---

## Part 1 — The Spec

### 1.1 Design principles settled in planning

- **Archive by filter, not by flag.** Nothing gets a new `archived` column. "Archived" is always a query filter on existing state (`Job.status`, `MaterialLot.quantity_remaining`). Same `?view=active` / `?view=archived` param pattern everywhere for consistency.
- **Permissions split on money and structure.** Employees do operational logging (what got used, what hours were worked). Managers do anything touching cost or lifecycle (create/edit/delete jobs, order material, transition statuses). This is the defensible one-sentence summary of the RBAC model.
- **Two enforcement layers.** Frontend hides controls (UX). Backend rejects writes (the actual guarantee). Never rely on the first alone.
- **Dashboard triages, routes manage.** Dashboard is read-only, curated, click-through-only. The Jobs/Inventory/Reorder routes are where actual work happens.

### 1.2 Route map

```
/login                      → LoginSignup (public)
/dashboard                  → Dashboard (triage surface)
/jobs                       → JobList (default: active; toggle: archived)
/jobs/:id                   → JobById (tabs: Overview | Materials Used | Labor Entries)
/materials                  → MaterialList (Inventory main view)
/materials/:id              → MaterialDetail (Lots; default active, toggle depleted)
/reorder-requests           → ReorderRequestList
/users                      → Users (Manager only, if built — stretch goal)
```

All authenticated routes wrapped in a single `AppLayout` (Sidebar + Topbar) via nested routing with `<Outlet />`.

### 1.3 Permissions matrix

| Route / Action | View | Create | Status / Edit | Archive / Terminal |
|---|---|---|---|---|
| **Dashboard** | Everyone | — | — | — |
| **Jobs** | Everyone | Manager only | Manager only | Manager only; `COMPLETED`/`CANCELLED` terminal + read-only |
| **Job → Materials Used** | Everyone | Both (blocked if job terminal) | — | — |
| **Job → order new material** | — | Manager only (blocked if terminal) | — | — |
| **Job → Labor Entries** | Everyone | Employee (own), Manager (any) | Manager corrections (blocked if terminal) | — |
| **Materials (Inventory)** | Everyone | Manager only | — | Never archived |
| **Lots (within Material)** | Everyone (active/archived toggle) | Manager only (receive lot) | — | Auto (depleted → archived) |
| **Reorder Requests** | Everyone | **Both** (employee on the floor sees the empty bin first) | Manager only (`PENDING` → `COMPLETED`/`DISMISSED`) | Manager (via `DISMISSED`) |

### 1.4 Job lifecycle

**Statuses:** `QUOTED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`

- **Active set** (`QUOTED`, `IN_PROGRESS`) — default Jobs list view, and the Dashboard's Pending Jobs widget
- **Archived set** (`COMPLETED`, `CANCELLED`) — hidden by default, surfaced via toggle
- **Transitions:** Manager only
- **Terminal:** `COMPLETED` and `CANCELLED` cannot be reversed. No reopen action. Corrections on closed jobs are a manual/DB-level intervention, deliberately out of app scope — note this in the README so it reads as a scope decision, not an oversight.
- **Read-only enforcement when terminal:**
  - Frontend: hide Edit button, hide log-usage and log-hours forms, render plain read views
  - Backend: reject writes to `Job`, `JobMaterialUsage`, and `LaborEntry` for any job in a terminal state — *regardless of role*. A Manager has edit rights generally but must not be able to log labor against a closed job.

### 1.5 JobById — the hub

90% of daily activity happens here. Tabbed layout:

| Tab | Contents | Employee | Manager |
|---|---|---|---|
| **Overview** | Job details, customer, status, **Total Job Cost hero** | View | Edit, change status, archive |
| **Materials Used** | Log usage against existing lots; running list w/ cost contribution | Log usage | Log usage + order new material |
| **Labor Entries** | Hours logged against this job | Log own hours | Log for anyone, edit corrections |

### 1.6 Total Job Cost display (core value prop)

Top of the Overview tab, hero treatment:

```
┌─────────────────────────────────┐
│   TOTAL JOB COST                │
│   $847.32                       │
│                                 │
│   Materials      Labor          │
│   $512.10        $335.22        │
└─────────────────────────────────┘
```

- Large anchor number — first thing the eye hits
- Materials/Labor subtotals beneath (existing model method already returns both — one call, destructure)
- No progress bar or color-coding: there's no quoted price to measure against, so nothing to signal over/under
- Must recompute/re-fetch whenever the Materials Used or Labor Entries tab logs something, so it never goes stale mid-session
- **Also as a column on the Jobs list** — near-zero cost since the method exists, and it reinforces the app's core value at a glance. Total only in the list; the subtotal breakdown stays exclusive to JobById. One-line removal if it feels cluttered.

### 1.7 Inventory — Materials vs Lots

**Why both exist** (worth being able to articulate — likely interview question):
1. **Reorder point must survive zero lots.** If all lots for a material are depleted and Inventory is a pure lots view, that material vanishes from screen at exactly the moment it most needs attention. A Material row persists regardless of lot count.
2. **The threshold lives on Material, not any lot** — it's an aggregate comparison, so something has to own "sum non-depleted lots vs. this number."
3. **Different lots carry different unit costs** (price drifts over time), which is what makes `JobMaterialUsage` costing accurate. Material = stable identity; Lot = batch, cost, quantity remaining.

**Materials list (`/materials`)** — main Inventory view
- One row per Material: name, aggregate available qty (sum of `quantity_remaining` across non-depleted lots), reorder point, status badge (fine / low / out)
- Aggregation + threshold comparison computed **backend, one query** — not recomputed client-side each render
- Never archived; Materials persist regardless of stock

**Material detail (`/materials/:id`)** — Lots view
- Lots: received date, unit cost, quantity remaining
- Default: `quantity_remaining > 0`; toggle: `= 0` (kept for cost history / job-costing traceability)

### 1.8 Reorder Requests

**Statuses:** `PENDING`, `COMPLETED`, `DISMISSED`

- **Create:** Employee or Manager — anyone can flag a need
- **Transition:** Manager only
- **Fulfillment is two decoupled steps:** (1) Manager marks request `COMPLETED`, (2) Manager separately receives a new `MaterialLot`. Not auto-linked. Two distinct buttons, not one combined action — deliberate, worth a README note.

### 1.9 Dashboard

**Differentiation from the Jobs route:** purpose, not quantity. Dashboard = triage ("what needs attention"), read-only, click-through only. Jobs route = manage (full list, filters, inline CRUD, archive toggle).

**Pending Jobs widget**
- `status IN (QUOTED, IN_PROGRESS)`, sorted `created_at ASC` — longest-waiting bubbles up
- Truncated to ~5, "View all" → `/jobs`
- No inline actions; row click → `/jobs/:id`
- *Future:* if a due-date or priority field is ever added, this is a one-line query change

**Low-Stock Materials widget**
- Materials where aggregate available qty < reorder point — **computed**, independent of whether a `ReorderRequest` exists
- Deliberately not "pending requests": this surfaces the gap *before* anyone flags it, which is the more useful dashboard signal
- Row click → `/materials/:id`, where a request can be created

**Stat cards** (top row): Active Jobs · Total Job Cost (period) · Low-Stock Materials count · Pending Reorder Requests count

---

## Part 2 — The Build Schedule

**Ordering principle:** layout shell first (everything else needs somewhere to render), then the highest-value vertical slice (Jobs → JobById → cost display), then Inventory, then Dashboard last since it depends on aggregates from everything else. Testing and README are protected time, not leftovers.

### Fri Aug 7 — 3.5h (9:00–11:30, 2:00–3:00)
**Goal: layout shell working, all routes reachable**

- `AppLayout.jsx` with `<Outlet />`, nested-route refactor of `App.jsx`
- `Sidebar.jsx` — Dashboard, Jobs, Inventory, Reorder Requests (+ Users if Manager)
- `Topbar.jsx` — logo, user, logout
- `layout.css`
- Stub components for every route so nothing 404s
- **Done when:** you can click every sidebar link and land on a named placeholder inside the shell

### Sat–Sun Aug 8–9 — unscheduled
Nothing planned. If a gig-free hour appears, best use is reading your own backend routes and writing down the exact response shape of each endpoint you'll consume — that makes Monday faster. Don't force it.

### Mon Aug 10 — 6h (9:00–3:00) — biggest block, biggest slice
**Goal: Jobs list + JobById skeleton**

- 9:00–11:00 — `JobList`: fetch active jobs, table (customer, status, created, **total cost column**), row → detail
- 11:00–12:00 — Active/Archived toggle wired to `?view=`
- 12:00–12:30 — break
- 12:30–2:00 — `JobById` shell: fetch by id, three-tab structure, Overview tab rendering job fields
- 2:00–3:00 — **Total Job Cost hero component** (Overview tab). This is the core value prop — give it its own focused stretch, don't rush it at the end of a tab-wiring session.
- **Done when:** you can browse jobs, toggle archive, open one, and see its cost prominently

### Tue Aug 11 — 2.5h (9:00–11:30, + optional)
**Goal: JobById fully functional**

- Materials Used tab: list existing usage, log-usage form (both roles)
- Labor Entries tab: list entries, log-hours form
- **Terminal-state read-only:** conditional render on `job.status` — hide forms/edit when `COMPLETED`/`CANCELLED`
- *If extra time appears:* start the backend terminal-state write guard (see Wed)

### Wed Aug 12 — 6h (9:00–3:00)
**Goal: Inventory complete + backend guard**

- 9:00–10:30 — **Backend: terminal-state write rejection** on `Job`, `JobMaterialUsage`, `LaborEntry`. Do this before more frontend — it's the integrity guarantee, and it's small.
- 10:30–12:00 — Backend: Materials aggregate endpoint (sum non-depleted lots, compare to reorder point, return status)
- 12:00–12:30 — break
- 12:30–2:00 — `MaterialList` — the aggregate Inventory view w/ status badges
- 2:00–3:00 — `MaterialDetail` — lots table + active/depleted toggle
- **Done when:** Inventory reads correctly end to end and closed jobs reject writes at the API level

### Thu Aug 13 — 6h (9:00–3:00)
**Goal: Reorder Requests + Dashboard**

- 9:00–11:00 — `ReorderRequestList`: list, create form (both roles), Manager-only status transitions
- 11:00–12:00 — Manager-only "receive new lot" form (the second half of two-step fulfillment)
- 12:00–12:30 — break
- 12:30–2:00 — Dashboard: stat cards + Pending Jobs widget
- 2:00–3:00 — Dashboard: Low-Stock Materials widget
- **Done when:** every route in the spec is functional. **Feature freeze at 3pm.**

### Fri Aug 14 — 6h (9:00–3:00) — no new features
**Goal: it works, it's tested, it's submittable**

- 9:00–10:30 — **Role testing.** Log in as Employee, attempt every Manager action, confirm both UI hiding and API rejection. Same for terminal-state writes. This is the most likely place bugs hide, since it's the logic you've written but never exercised.
- 10:30–11:30 — Responsive pass: sidebar collapse, table overflow on narrow screens
- 11:30–12:00 — Loading and error states on every fetch (empty lists, failed requests)
- 12:00–12:30 — break
- 12:30–1:30 — **README:** permissions matrix (§1.3), the Materials-vs-Lots rationale (§1.7), and the deliberate scope cuts (no reopen, two-step fulfillment). These make design decisions legible to a reviewer instead of looking accidental.
- 1:30–2:30 — Full click-through of every route as both roles, fix what surfaces
- 2:30–3:00 — Final commit, push, **submit**

### Sat Aug 15 — deadline
Buffer only. If Friday went to plan, nothing should be left here.

---

## Part 3 — Risk Notes

- **Biggest schedule risk is Monday.** It's your largest block and carries the most new surface area. If you fall behind, the thing to cut is the Jobs-list cost column (§1.6) — it's the only genuinely optional item before Wednesday.
- **Recharts / any chart is explicitly out of scope.** It was in the original article-inspired plan; it is not on this schedule. Only add it if you finish Thursday early, and only then.
- **The Users route is a stretch goal.** Sidebar link is role-gated and ready, but the page itself isn't scheduled. Ship without it if needed.
- **Don't start new features on Friday.** A half-finished feature is worse for a reviewer than a clean, complete, smaller app.

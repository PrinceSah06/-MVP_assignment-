# Graphy CRM Backend + Frontend

## Install dependencies

```bash
bun install
```

## Run API (Terminal 1)

```bash
bun run dev:api
```

API default: `http://localhost:3000`
If `3000` is busy, API auto-falls back to `http://localhost:3002`.

## Run Frontend (Terminal 2)

```bash
bun run dev:ui
```

Frontend URL: `http://localhost:3001`

In frontend settings, keep backend base URL as: `http://localhost:3000`
# Graphy CRM – Lead Management System

## Overview

Graphy CRM is a **Lead Management System** built to support the Gharpayy PG Reservation platform.

The system allows teams to capture leads, automatically assign them to agents, manage a sales pipeline, schedule property visits, and monitor performance through a dashboard.

The architecture is designed to support:

* 30+ internal CRM users
* 100+ property owners contributing inventory
* 10,000+ daily visitors generating leads

This project implements the **core CRM backend and UI foundation** needed for the lead-to-visit workflow.

---

# Tech Stack

Backend

* Bun
* Hono
* PostgreSQL
* Drizzle ORM
* Redis

Frontend

* React
* Vite
* Tailwind CSS

Infrastructure

* Docker
* Docker Compose

---

# System Architecture

```
Frontend (React UI)
        │
        ▼
API Server (Bun + Hono)
        │
        ▼
Service Layer
        │
        ▼
PostgreSQL Database (Drizzle ORM)
        │
        ▼
Redis (Lead Assignment State)
```

The backend follows a **modular architecture**:

```
src/
 ├─ modules
 │   ├─ leads
 │   ├─ visits
 │   ├─ dashboard
 │
 ├─ services
 │   └─ leadAssignment.service.ts
 │
 ├─ db
 │   └─ schema.ts
```

This structure keeps **routes, business logic, and database layers separated**, making the system scalable.

---

# Core Features

## Lead Capture

API Endpoint

```
POST /leads
```

Creates a new lead from forms or APIs.

Fields stored:

* name
* phone
* source
* status
* assignedAgent
* createdAt
* updatedAt

---

## Automatic Lead Assignment

Leads are distributed among agents using **Round Robin assignment**.

Example:

```
Lead1 → Agent1
Lead2 → Agent2
Lead3 → Agent3
Lead4 → Agent1
```

Redis stores the assignment index to maintain fair distribution.

---

## Lead Pipeline

Leads move through defined CRM stages.

```
New
Contacted
Requirement Collected
Property Suggested
Visit Scheduled
Visit Completed
Booked
Lost
```

API

```
PATCH /leads/:id/status
```

---

## Visit Scheduling

Agents can schedule visits for leads.

API

```
POST /visits
```

Fields

* leadId
* property
* visitDate
* visitTime

When a visit is scheduled, the lead status is updated automatically.

---

## Dashboard Analytics

API

```
GET /dashboard
```

Returns:

* total leads
* visits scheduled
* leads by pipeline stage
* bookings

This provides performance insights for managers.

---

## Activity Logging

Important CRM actions are recorded in an **activities table**.

Examples:

* Lead Created
* Status Updated
* Visit Scheduled

This allows tracking of all CRM changes.

---

# Database Tables

The system currently uses the following tables:

```
agents
leads
visits
conversations
activities
```

These support the **core lead-to-booking pipeline**.

---

# Running the Project

## Install dependencies

```
bun install
```

---

## Run API (Terminal 1)

```
bun run dev:api
```

API default

```
http://localhost:3000
```

If port 3000 is busy, the API automatically falls back to

```
http://localhost:3002
```

---

## Run Frontend (Terminal 2)

```
bun run dev:ui
```

Frontend URL

```
http://localhost:3001
```

In frontend settings, set backend base URL:

```
http://localhost:3000
```

---

# Port Override (Optional)

If you want to run the API on a different port.

PowerShell:

```
$env:API_PORT=3002; bun run dev:api
```

---

# Future Improvements

To extend this into a full PG reservation platform:

* Role-based access control (RBAC)
* Property inventory management
* Reservation & booking system
* Payment gateway integration
* Notification system
* Automation jobs
* Owner portal APIs

---

# Author

Prince Sah

Backend Developer
Bun • Hono • PostgreSQL • Drizzle


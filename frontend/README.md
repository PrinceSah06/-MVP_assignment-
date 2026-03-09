# Frontend (Graphy CRM Console)

## Run

1. Start backend on `http://localhost:3000`
2. Serve frontend on a different port (important):

```bash
# Example (from project root)
bun run dev:ui
```

3. Open `http://localhost:3001`
4. In UI, set Backend Base URL to `http://localhost:3000` and click Save URL.
5. If backend falls back to port `3002`, UI can auto-detect and switch.

## Fast test in UI

1. Click `Run Demo Flow` in the Quick Start panel.
2. It will:
- create lead
- update lead status
- schedule visit
- refresh dashboard
3. Check API Response log for success.

## Features

- Create lead: `POST /leads`
- Update lead status: `PATCH /leads/:id/status`
- Schedule visit: `POST /visits`
- Dashboard stats: `GET /dashboard`

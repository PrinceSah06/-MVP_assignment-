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

## Port override (optional)

If you want to force another API port:

PowerShell:

```powershell
$env:API_PORT=3002; bun run dev:api
```

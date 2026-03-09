import { Hono } from "hono";
import { cors } from "hono/cors";
import { leadsRouter } from "./modules/leads/leads.routes";
import { visitsRouter } from "./modules/visits/visits.route.ts";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.ts";

export const app = new Hono();
const preferredPort = Number(process.env.API_PORT || process.env.PORT || 3000);

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (c) => {
  return c.text("CRM API Running");
});
app.get("/dashbord", (c) => c.text("visits route working"));

app.route("/leads", leadsRouter);
app.route("/visits", visitsRouter);
app.route("/dashboard", dashboardRouter);

if (import.meta.main) {
  const candidatePorts = [preferredPort];
  if (preferredPort === 3000) {
    candidatePorts.push(3002);
  }

  let started = false;
  for (const port of candidatePorts) {
    try {
      Bun.serve({
        port,
        fetch: app.fetch,
      });
      console.log(`CRM API running at http://localhost:${port}`);
      if (port !== preferredPort) {
        console.warn(`Port ${preferredPort} was busy, fallback started on ${port}`);
      }
      started = true;
      break;
    } catch (error) {
      const err = error as { code?: string };
      if (err.code !== "EADDRINUSE") {
        throw error;
      }
    }
  }

  if (!started) {
    throw new Error(
      `Unable to start API. Tried ports: ${candidatePorts.join(", ")}`
    );
  }
}

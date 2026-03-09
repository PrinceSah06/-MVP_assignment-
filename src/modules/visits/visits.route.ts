import { Hono } from "hono";
import { scheduleVisit } from "./visits.service";

export const visitsRouter = new Hono();

visitsRouter.post("/", async (c) => {
    
    console.log('inside visit routes')
  const body = await c.req.json();

  const visit = await scheduleVisit(body);

  return c.json({
    success: true,
    data: visit,
  });
});
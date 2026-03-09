import { Hono } from "hono";
import { getDashboardStats } from "./dashboard.service";

export const dashboardRouter = new Hono();

dashboardRouter.get("/", async (c) => {

  const stats = await getDashboardStats();

  return c.json({
    success: true,
    data: stats
  });

});
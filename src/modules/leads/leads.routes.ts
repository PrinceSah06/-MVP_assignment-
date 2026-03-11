import { Hono } from "hono";
import { createLead, updateLeadStatus } from "./leads.service";
import { requireRole } from "../../middleware/role.middleware";
import { activities } from "../../db/schema";

export const leadsRouter = new Hono();

leadsRouter.post("/",  requireRole("admin"),async (c) => {

  const body = await c.req.json();

  const lead = await createLead({
    name: body.name,
    phone: body.phone,
    source: body.source
  });

  return c.json({
    success: true,
    data: lead
  });

});

leadsRouter.patch("/:id/status", async (c) => {

  const role = c.req.header("role");

  if (role !== "admin" && role !== "agent") {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const lead = await updateLeadStatus(id, body.status);

  return c.json({
    success: true,
    data: lead
  });

});
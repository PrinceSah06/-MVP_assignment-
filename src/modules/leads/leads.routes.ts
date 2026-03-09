import { Hono } from "hono";
import { createLead, updateLeadStatus } from "./leads.service";

export const leadsRouter = new Hono();

leadsRouter.post("/", async (c) => {

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
  console.log('inside patch request   test  id')
  const id = Number(c.req.param("id"));

  const body = await c.req.json();

  const lead = await updateLeadStatus(id, body.status);

  return c.json({
    success: true,
    data: lead
  });
});
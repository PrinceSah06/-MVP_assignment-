import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("CRM API Running");
});

export default {
  port: 3000,
  fetch: app.fetch,
};
import type  { Context, Next } from "hono";

export function requireRole(role: string) {
  return async (c: Context, next: Next) => {

    const userRole = c.req.header("role");

    if (userRole !== role) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    await next();
  };
}
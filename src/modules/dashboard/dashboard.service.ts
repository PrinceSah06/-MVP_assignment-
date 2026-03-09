import { db } from "../../config/db";
import { leads, visits } from "../../db/schema";
import { sql } from "drizzle-orm";

export async function getDashboardStats() {

  const totalLeads = await db.select({
    count: sql<number>`count(*)`
  }).from(leads);

  const visitsScheduled = await db.select({
    count: sql<number>`count(*)`
  }).from(visits);

  const leadsByStatus = await db.execute(
    sql`
      SELECT status, COUNT(*) 
      FROM leads
      GROUP BY status
    `
  );

  return {
    totalLeads: totalLeads[0]?.count,
    visitsScheduled: visitsScheduled[0]?.count,
    leadsByStatus
  };
}
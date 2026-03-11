import { db } from "../../config/db";
import { leads, visits } from "../../db/schema";
import { sql } from "drizzle-orm";

export async function getDashboardStats() {

  // total leads
  const totalLeadsResult = await db.select({
    count: sql<number>`count(*)`
  }).from(leads);

  // total visits scheduled
  const visitsScheduledResult = await db.select({
    count: sql<number>`count(*)`
  }).from(visits);

  // leads grouped by status
  const leadsByStatusResult = await db.execute(
    sql`
      SELECT status, COUNT(*) as count
      FROM leads
      GROUP BY status
    `
  );

  // bookings
  const bookingsResult = await db.execute(
    sql`
      SELECT COUNT(*) as count
      FROM leads
      WHERE status = 'Booked'
    `
  );

  return {
    totalLeads: Number(totalLeadsResult[0]?.count || 0),
    visitsScheduled: Number(visitsScheduledResult[0]?.count || 0),
    leadsByStatus: leadsByStatusResult.rows,
    bookings: Number(bookingsResult.rows[0]?.count || 0)
  };
}
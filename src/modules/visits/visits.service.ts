import { db } from "../../config/db";
import { visits, leads } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function scheduleVisit(data: {
  leadId: number;
  property: string;
  visitDate: string;
  visitTime: string;
}) {

  const result = await db.insert(visits).values({
    leadId: data.leadId,
    property: data.property,
    visitDate: data.visitDate,
    visitTime: data.visitTime,
  }).returning();

  // update lead pipeline stage
  await db
    .update(leads)
    .set({ status: "Visit Scheduled" })
    .where(eq(leads.id, data.leadId));

  return result[0];
}
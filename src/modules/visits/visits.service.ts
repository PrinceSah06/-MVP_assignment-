import { db } from "../../config/db";
import { visits } from "../../db/schema";

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

  return result[0];
}
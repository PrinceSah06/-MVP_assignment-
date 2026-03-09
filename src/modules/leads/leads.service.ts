import { db } from "../../config/db";
import { leads } from "../../db/schema";
import { assignAgent } from "../../services/leadAssignment.service";


import { eq } from "drizzle-orm";

export async function updateLeadStatus(id: number, status: string) {
  const result = await db
    .update(leads)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();

  return result[0];
}
export async function createLead(data: {
  name: string;
  phone: string;
  source?: string;
}) {

  // assign agent
  const agentId = await assignAgent();

  const result = await db.insert(leads).values({
    name: data.name,
    phone: data.phone,
    source: data.source,
    assignedAgent: agentId,
  }).returning();

  return result[0];
}
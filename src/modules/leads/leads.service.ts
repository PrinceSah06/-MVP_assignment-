import { db } from "../../config/db";
import { leads } from "../../db/schema";
import { assignAgent } from "../../services/leadAssignment.service";
import {  activities } from "../../db/schema";

import { eq } from "drizzle-orm";

const allowedStatuses = [
  "New",
  "Contacted",
  "Requirement Collected",
  "Property Suggested",
  "Visit Scheduled",
  "Visit Completed",
  "Booked",
  "Lost"
];

export async function updateLeadStatus(id: number, status: string) {

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const result = await db
    .update(leads)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();

  // activity log
  await db.insert(activities).values({
    action: `Status Updated to ${status}`,
    leadId: id
  });

  return result[0];
}
export async function createLead(data: {
  name: string;
  phone: string;
  source?: string;
}) {

  const agentId = await assignAgent();

  const result = await db.insert(leads).values({
    name: data.name,
    phone: data.phone,
    source: data.source,
    status: "New",
    assignedAgent: agentId,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  const lead = result[0];

  // activity log
  await db.insert(activities).values({
    action: "Lead Created",
    leadId: lead?.id
  });

  return lead;
}
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
});

import { integer } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  phone: text("phone").notNull(),

  source: text("source"),

  status: text("status").default("NEW"),

  assignedAgent: integer("assigned_agent"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),

  leadId: integer("lead_id").notNull(),

  property: text("property").notNull(),

  visitDate: text("visit_date"),

  visitTime: text("visit_time"),

  outcome: text("outcome"),

  createdAt: timestamp("created_at").defaultNow(),
});
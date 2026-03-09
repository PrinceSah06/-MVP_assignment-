import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = "postgres://postgres:postgres@localhost:5432/crm";

const client = postgres(connectionString);

export const db = drizzle(client);
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create a database connection
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

export const db = drizzle(client);

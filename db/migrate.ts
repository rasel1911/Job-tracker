import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection, {
    logger: {
      logQuery(query: string, params: unknown[]) {
        // Custom logger to ignore relation already exists errors
        if (query.includes("CREATE TABLE") && query.includes("IF NOT EXISTS")) {
          return;
        }
        console.log("Query:", query, params);
      },
    },
  });

  console.log("⏳ Running migrations...");

  const start = Date.now();
  try {
    await migrate(db, {
      migrationsFolder: "./db/migrations",
      migrationsTable: "drizzle_migrations",
      migrationsSchema: "public",
    });
  } catch (error: any) {
    // Check if the error is about relation already existing
    if (
      error.message &&
      error.message.includes("already exists") &&
      error.message.includes("relation")
    ) {
      console.log("ℹ️  Relation already exists, continuing...");
    } else {
      throw error; // Re-throw if it's a different error
    }
  }
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});

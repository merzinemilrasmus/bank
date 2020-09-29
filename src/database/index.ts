import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost";

export default new Pool({
  connectionString: DATABASE_URL,
});

export * as users from "./users";

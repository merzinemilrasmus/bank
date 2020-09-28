import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default pool;
export * as users from "./users";

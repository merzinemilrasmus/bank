import { Pool } from "pg";
import { DATABASE_URL } from "../constants";

export default new Pool({
  connectionString: DATABASE_URL,
});

export * as users from "./users";
export * as transactions from "./transactions";

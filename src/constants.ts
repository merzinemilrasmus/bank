require("dotenv").config();
import { readFileSync } from "fs";

export const HOST = process.env.HOST || "localhost";
export const PORT = Number(process.env.PORT) || 3000;

export const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost";

export const SESSION_SIGNING_SECRET =
  process.env.SESSION_SIGNING_SECRET || String(Math.random());

export const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME || "60m";

export const ACCOUNT_PREFIX = process.env.ACCOUNT_PREFIX || "ERM";

export const JWKS = JSON.parse(readFileSync("jwks.json").toString());

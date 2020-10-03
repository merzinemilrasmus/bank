require("dotenv").config();

export const HOST = process.env.HOST || "localhost";
export const PORT = Number(process.env.PORT) || 3000;

export const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost";

export const PRIVATE_KEY = process.env.PRIVATE_KEY || String(Math.random());

export const TOKEN_LIFETIME = Number(process.env.TOKEN_LIFETIME) || 3600;

export const ACCOUNT_PREFIX = process.env.ACCOUNT_PREFIX || "ERM";

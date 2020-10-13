require("dotenv").config();
import { JWK } from "jose";
import { readFileSync } from "fs";

export const HOST = process.env.HOST || "localhost";
export const PORT = Number(process.env.PORT) || 3000;

export const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost";

let jwk: JWK.Key;
try {
  const key = readFileSync("secret.pem");
  jwk = JWK.asKey(key);
} catch (_) {
  console.log("private key not present, generating...");
  jwk = JWK.generateSync("RSA");
}

export const PRIVATE_KEY = jwk;

export const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME || "60m";

export const ACCOUNT_PREFIX = process.env.ACCOUNT_PREFIX || "ERM";

import * as jwt from "jsonwebtoken";

const PRIVATE_KEY = process.env.PRIVATE_KEY || String(Math.random());
const TOKEN_LIFETIME = Number(process.env.TOKEN_LIFETIME) || 3600;

export interface Payload {
  [p: string]: any;
}

export const sign = (payload: Payload) =>
  jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: TOKEN_LIFETIME,
  });

export const verify = (token: string) => jwt.verify(token, PRIVATE_KEY);

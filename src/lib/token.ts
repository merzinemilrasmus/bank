import { JWT } from "jose";
import { SESSION_SIGNING_SECRET, TOKEN_LIFETIME } from "../constants";

export interface TokenPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export const sign = (payload: TokenPayload) =>
  JWT.sign(payload, SESSION_SIGNING_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });

export const verify = (token: string) =>
  JWT.verify(token, SESSION_SIGNING_SECRET) as TokenPayload;

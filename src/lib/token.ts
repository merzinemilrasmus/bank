import * as jwt from "jsonwebtoken";
import { SESSION_SIGNING_SECRET, TOKEN_LIFETIME } from "../constants";

export interface TokenPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export const sign = (payload: TokenPayload) =>
  jwt.sign(payload, SESSION_SIGNING_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });

export const verify = (token: string) =>
  jwt.verify(token, SESSION_SIGNING_SECRET) as TokenPayload;

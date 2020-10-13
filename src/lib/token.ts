import { JWT } from "jose";
import { PRIVATE_KEY, TOKEN_LIFETIME } from "../constants";

export interface TokenPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export const sign = (payload: TokenPayload) =>
  JWT.sign(payload, PRIVATE_KEY, {
    expiresIn: TOKEN_LIFETIME,
  });

export const verify = (token: string) =>
  JWT.verify(token, PRIVATE_KEY) as TokenPayload;

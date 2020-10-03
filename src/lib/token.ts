import * as jwt from "jsonwebtoken";
import { PRIVATE_KEY, TOKEN_LIFETIME } from "../constants";

export interface TokenPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export const sign = (payload: TokenPayload) =>
  jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: TOKEN_LIFETIME,
  });

export const verify = (token: string) =>
  jwt.verify(token, PRIVATE_KEY) as TokenPayload;

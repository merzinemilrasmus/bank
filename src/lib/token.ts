import * as jwt from "jsonwebtoken";

const SECRET = "koala";
const TOKEN_LIFETIME = 60 * 5;

export const sign = (payload: string | object) =>
  jwt.sign(payload, SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });

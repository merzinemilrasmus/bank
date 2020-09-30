import { verify, TokenPayload } from "../lib/token";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    tokenPayload?: TokenPayload;
  }
}

export default (req: Request, _: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (token) {
    try {
      const payload = <TokenPayload>verify(token);
      req.tokenPayload = payload;
    } catch (_) {}
  }
  next();
};

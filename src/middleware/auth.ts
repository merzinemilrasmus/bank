import { verify, Payload } from "../lib/token";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    payload?: Payload;
    newToken?: string;
  }
}

export default (req: Request, _: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (token) {
    try {
      const payload = <Payload>verify(token);
      req.payload = payload;
    } catch (_) {}
  }
  next();
};

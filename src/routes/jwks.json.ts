import { Router } from "express";
import { JWKS } from "../constants";
const router = Router();

router.get("/", (_, res) =>
  res.json({
    keys: JWKS.keys.map((pair: any) => ({
      kty: pair.kty,
      e: pair.e,
      use: pair.use,
      n: pair.n,
    })),
  })
);

export default router;

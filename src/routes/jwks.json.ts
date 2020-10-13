import { Router } from "express";
import { PRIVATE_KEY } from "../constants";
import { JWKS } from "jose";
const router = Router();

router.get("/", (_, res) =>
  res.json(new JWKS.KeyStore([PRIVATE_KEY]).toJWKS())
);

export default router;

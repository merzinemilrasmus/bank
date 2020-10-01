import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

import pool, { users } from "../database";
import dbErr from "../lib/dbErr";

const router = Router();

router.post(
  "/",
  [
    body("name").not().isEmpty(),
    body("username").not().isEmpty(),
    body("password").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await users.create(pool, req.body);
      res.status(201).json(profile);
    } catch (e) {
      dbErr(e, res);
    }
  }
);

router.get(
  "/:id",
  param("id").isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.tokenPayload) {
      return res.status(401).end();
    }

    const id = req.params.id;
    if (Number(req.tokenPayload.id) !== Number(id)) {
      return res.status(403).end();
    }

    try {
      const profile = await users.profile(pool, Number(id));
      res.status(200).json(profile);
    } catch (e) {
      dbErr(e, res);
    }
  }
);

export default router;

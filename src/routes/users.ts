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

const profile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.tokenPayload) {
    return res.sendStatus(401);
  }

  const id = Number(req.tokenPayload.id);
  if (req.params.id && id !== Number(req.params.id)) {
    return res.sendStatus(403);
  }

  try {
    const profile = await users.profile(pool, id);
    res.status(200).json(profile);
  } catch (e) {
    dbErr(e, res);
  }
};

router.get("/", profile);

router.get("/:id", param("id").isNumeric(), profile);

export default router;

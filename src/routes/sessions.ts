import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import pool, { users } from "../database";
import { sign } from "../lib/token";
import dbErr from "../lib/dbErr";

const router = Router();

router.post(
  "/",
  [body("username").not().isEmpty(), body("password").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await users.verify(pool, req.body);
      res.status(200).json({
        jwt: sign({ id: user.id }),
      });
    } catch (e) {
      dbErr(e, res);
    }
  }
);

export default router;

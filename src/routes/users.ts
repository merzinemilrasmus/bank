import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import pool, { users } from "../database";

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
    if (errors.isEmpty()) {
      try {
        const dbRes = await users.create(pool, req.body);
        res.status(201).json(dbRes);
      } catch (e) {
        switch (Number(e.code)) {
          case 23505:
            res.status(409).end();
            break;
          default:
            res.status(500).end();
            console.log(e);
        }
      }
    } else {
      res.status(400).json({ errors: errors.array() });
    }
  }
);

export default router;

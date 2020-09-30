import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import pool, { transactions } from "../database";
import dbErr from "../lib/dbErr";

const router = Router();

router.post(
  "/",
  [
    body("accountFrom").isNumeric(),
    body("accountTo").isNumeric(),
    body("amount").isNumeric(),
    body("currency").not().isEmpty(),
    body("explanation").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountFrom, accountTo, amount, currency, explanation } = req.body;
    if (currency.toLowerCase() !== "usd") {
      return res.status(501).end();
    }

    if (!req.tokenPayload) {
      return res.status(401).end();
    }

    try {
      const transaction = await transactions.create(pool, {
        user_id: Number(req.tokenPayload.id),
        from_id: Number(accountFrom),
        to_id: Number(accountTo),
        amount,
        explanation,
      });
      res.status(201).json(transaction);
    } catch (e) {
      dbErr(e, res);
    }
  }
);

router.get("/", async (req: Request, res) => {
  if (!req.tokenPayload) {
    return res.status(401).end();
  }

  try {
    const transactionList = await transactions.list(
      pool,
      Number(req.tokenPayload.id)
    );
    res.status(200).json(transactionList);
  } catch (e) {
    dbErr(e, res);
  }
});

export default router;

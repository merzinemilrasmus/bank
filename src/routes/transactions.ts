import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import pool, { transactions } from "../database";
import dbErr from "../lib/dbErr";

const router = Router();

router.post(
  "/",
  [
    body("accountFrom").not().isEmpty(),
    body("accountTo").not().isEmpty(),
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
      return res.sendStatus(501);
    }

    if (!req.tokenPayload) {
      return res.sendStatus(401);
    }

    try {
      const transaction = await transactions.create(pool, {
        userId: Number(req.tokenPayload.id),
        accountFrom,
        accountTo,
        amount,
        explanation,
      });
      switch (transaction.status) {
        case transactions.TransactionStatus.Success:
          res.status(201);
          break;
        case transactions.TransactionStatus.Pending:
          res.status(202);
          break;
        default:
          res.status(500);
      }
      res.json(transaction);
    } catch (e) {
      dbErr(e, res);
    }
  }
);

router.get("/", async (req: Request, res) => {
  if (!req.tokenPayload) {
    return res.sendStatus(401);
  }

  try {
    const transactionList = await transactions.list(
      pool,
      Number(req.tokenPayload.id)
    );
    res.status(200).json({ transactions: transactionList });
  } catch (e) {
    dbErr(e, res);
  }
});

export default router;

import { Router, Request, Response } from "express";
import {
  body,
  Location,
  ValidationError,
  validationResult,
} from "express-validator";
import { JWT } from "jose";

const router = Router();

router.post(
  "/",
  [body("jwt").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jwt } = req.body;
    const jwtErrors: ValidationError[] = [];
    let payload: any;
    try {
      payload = JWT.decode(jwt);

      for (const param of [
        "accountFrom",
        "accountTo",
        "amount",
        "currency",
        "explanation",
        "senderName",
      ]) {
        let value = payload[param];
        if (["amount"].includes(param)) value = Number(value);
        if (!value)
          jwtErrors.push({
            location: <Location>"body.jwt",
            msg: "Invalid value",
            param,
            value,
          });
      }
    } catch (_) {
      jwtErrors.push({
        location: <Location>"body",
        msg: "Invalid value",
        param: "jwt",
        value: jwt,
      });
    }

    if (jwtErrors.length > 0) {
      return res.status(400).json({ errors: jwtErrors });
    }

    // const { accountFrom } = payload;
    // const bankPrefix = accountFrom.substring(0, 3);

    res.sendStatus(404);
    // look for bank (request central bank for update if not found)
    // try transaction create
  }
);

export default router;

import { Response } from "express";

export default (e: any, res: Response) => {
  if (e.http) res.status(e.http);
  else {
    res.status(500);
    console.log(e);
  }
  if (e.msg) res.json({ error: e.msg });
  else res.end();
};

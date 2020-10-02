import { Response } from "express";

export default (e: any, res: Response) => {
  if (e && e.http) res.status(e.http);
  else {
    res.status(500);
    console.log(e);
  }
  if (e && e.msg) res.json({ error: e.msg });
  else res.end();
};

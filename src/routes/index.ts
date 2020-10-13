import * as fs from "fs";
import { Router } from "express";
const router = Router();

fs.readdirSync(__dirname).forEach(
  (file) =>
    !/^index/.test(file) &&
    router.use(`/${file.replace(/\.[^.]*$/, "")}`, require(`./${file}`).default)
);

export default router;

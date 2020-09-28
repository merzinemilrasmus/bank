import { Router } from "express";
const router = Router();

import users from "./users";
router.use("/users", users);

router.get("/", (_, res) => res.end("Hello, World!"));

export default router;

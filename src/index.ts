require("dotenv").config();

import * as express from "express";
import cors from "./middleware/cors";
import _ from "./database";
import routes from "./routes";

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(cors, routes);

app.listen(PORT, HOST, () =>
  console.log(`listening on \u{1b}[1mhttp://${HOST}:${PORT}\u{1b}[m`)
);

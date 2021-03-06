require("dotenv").config();

import * as express from "express";
import cors from "./middleware/cors";
import auth from "./middleware/auth";
import routes from "./routes";

const HOST = process.env.HOST || "localhost";
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(cors, auth, express.json(), routes);

app.listen(PORT, HOST, () =>
  console.log(`listening on \u{1b}[1mhttp://${HOST}:${PORT}\u{1b}[m`)
);

import * as express from "express";
import cors from "./middleware/cors";
import auth from "./middleware/auth";
import routes from "./routes";
import { HOST, PORT } from "./constants";

const app = express();
app.use(cors, auth, express.json(), routes);

app.listen(PORT, HOST, () =>
  console.log(`listening on \u{1b}[1mhttp://${HOST}:${PORT}\u{1b}[m`)
);

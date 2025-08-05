import express from "express";
import config from "./config/index.js";
import { globalError } from "./error/global-error-handler.js";
import { connectDB } from "./db/index.js";
import router from "./routes/index.js";

const app = express();

const PORT = config.PORT;

app.use(express.json());

await connectDB();

app.use("/api", router);

app.use(globalError);

app.listen(PORT, () => console.log("Server running on port: ", PORT));

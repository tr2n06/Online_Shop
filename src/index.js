
import express from "express";
import db from "./config/db.config.js";
import { mainRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api", mainRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


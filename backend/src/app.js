import express from "express";
import cors from "cors";
import { gameRouter } from "./routes/gameRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", gameRouter);
// test api
app.get("/api", (req, res) => {
    res.json({ Message: "Hello worold" });
});
export default app;

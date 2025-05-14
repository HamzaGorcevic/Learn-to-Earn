import express from "express";
import { postResult } from "../controllers/gameController.js";
export const gameRouter = express.Router();

gameRouter.post("/game", postResult);

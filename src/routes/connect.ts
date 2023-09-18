import { Router } from "express";
import { tryCatchWapper } from "../controllers/errorController";

const connectRoute = Router();

connectRoute.post("/chat", tryCatchWapper(handleLogin));

export default connectRoute;

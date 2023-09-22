import { Router } from "express";
import {
	sendOTPEmail,
	handleSignupByEmail,
	handleLogin,
} from "../controllers/authController";
import { tryCatchWapper } from "../controllers/errorController";

const authRoute = Router();

authRoute.get("/get-email-otp/:email", tryCatchWapper(sendOTPEmail));

authRoute.post("/signup-email", tryCatchWapper(handleSignupByEmail));

authRoute.post("/login", tryCatchWapper(handleLogin));

export default authRoute;

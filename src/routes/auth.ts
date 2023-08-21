import { Router } from "express";
import {
	handleLogin,
	handleSignupByEmail,
	sendOTPEmail,
} from "../controllers/authController";
import { tryCatchWapper } from "../controllers/errorController";

const authRoute = Router();

authRoute.get("/get-email-otp/:email", tryCatchWapper(sendOTPEmail));

// authRouter.get("/get-sms-otp/:phone_number", tryCatchWapper(sendOTPSMS));

authRoute.post("/signup-email", tryCatchWapper(handleSignupByEmail));

// authRouter.post("/signup-phone", tryCatchWapper(handleSignupByPhone));

authRoute.post("/login", tryCatchWapper(handleLogin));

export default authRoute;

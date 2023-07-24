import { Router } from "express";
import {
	handleLogin,
	handleSignupByEmail,
	handleSignupByPhone,
	sendOTPEmail,
	sendOTPSMS,
} from "../controllers/authController";

const authRouter = Router();

authRouter.get("/get-email-otp/:email", sendOTPEmail);

authRouter.get("/get-sms-otp/:phone_number", sendOTPSMS);

authRouter.post("/signup", handleSignupByPhone, handleSignupByEmail);

authRouter.post("/login", handleLogin);

export default authRouter;

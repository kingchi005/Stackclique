import { Router, Request, Response } from "express";
import {
	emailSchema,
	loginInputSchema,
	emailSignupInputSchema,
} from "../zodSchema/inputSchema";
import { ErrorResponse, SuccessResponse } from "../types";
import { z } from "zod";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { transporter } from "../controllers/mailcontroller";
import jwt from "jsonwebtoken";
import {
	handleLogin,
	handleSignupByEmail,
	handleSignupByPhone,
	sendOTPEmail,
	sendOTPSMS,
} from "../controllers/authController";
import { anthenticUser } from "../controllers/middleWares";

const authRouter = Router();

authRouter.get("/get-email-otp/:email", sendOTPEmail);

authRouter.get("/get-sms-otp/:phone_number", sendOTPSMS);

authRouter.post("/signup", handleSignupByPhone, handleSignupByEmail);

authRouter.post("/login", handleLogin);

export default authRouter;

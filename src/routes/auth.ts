import { Router, Request, Response } from "express";
import {
	emailSchema,
	loginInputSchema,
	signupInputSchema,
} from "../zodSchema/inputSchema";
import { ErrorResponse, SuccessResponse } from "../types";
import { z } from "zod";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { transporter } from "../controllers/mailcontroller";
import jwt from "jsonwebtoken";
import {
	handleLogin,
	handleSignup,
	requestVerificationEmail,
} from "../controllers/authController";
import { anthenticUser } from "../controllers/middleWares";

const authRouter = Router();

authRouter.get(
	"/send-verification/:email",
	// anthenticUser,
	requestVerificationEmail
);

authRouter.post("/signup", handleSignup);

authRouter.post("/login", handleLogin);

export default authRouter;

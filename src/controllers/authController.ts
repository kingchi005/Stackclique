import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../prisma";
import { ErrorResponse, SuccessResponse } from "../types";
import {
	emailSchema,
	loginInputSchema,
	signupInputSchema,
} from "../zodSchema/inputSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const requestVerificationEmail = async (req: Request, res: Response) => {
	const safe = z.object({ email: emailSchema }).safeParse(req.params);
	if (!safe.success)
		return res.status(401).json(<ErrorResponse<typeof safe.error>>{
			ok: false,
			error: {
				message: safe.error.issues.map((d) => d.message).join(", "),
				details: safe.error,
			},
		});

	const { email } = safe.data;
	const alreadyVerified = await prisma.userEmailVerificationToken.findFirst({
		where: { email, verified: true },
	});

	if (alreadyVerified)
		return res.status(202).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Your email is already verified" },
		});

	const OTP = (() => Math.floor(Math.random() * 9000) + 1000)();

	try {
		const generatedUserOTP = await prisma.userEmailVerificationToken.upsert({
			where: { email, verified: false },
			update: {
				otp: OTP,
				expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
			},
			create: {
				email,
				otp: OTP,
				expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
			},
			select: { email: true, otp: true, expiredAt: true },
		});
	} catch (error) {
		console.log(error);
	}

	// send email with OTP---------------------------------------
	// transporter.sendMail
	// if email sent

	res.status(200).json(<SuccessResponse<any>>{
		ok: true,
		data: {},
		message: `Email was sent to '${email}'. Please check you email`,
	});
};

export const handleSignup = async (req: Request, res: Response) => {
	// validate user input
	const safe = signupInputSchema.safeParse(req.body);
	if (!safe.success)
		return res.status(400).json(<ErrorResponse<typeof safe.error>>{
			ok: false,
			error: {
				message: safe.error.issues.map((d) => d.message).join(", "),
				details: safe.error,
			},
		});

	const { email, otp, password, username } = safe.data;

	// check if user already exists-------------------------
	const existingUser = await prisma.user.findFirst({ where: { email } });
	if (existingUser)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: `User with email '${email}' already exists` },
		});

	// verify email using OTP
	const foundOTP = await prisma.userEmailVerificationToken.findUnique({
		where: { email, otp, verified: false },
	});

	if (!foundOTP)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Invalid OTP or email" },
		});

	if (foundOTP.expiredAt < new Date())
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "OTP has expired" },
		});

	// user verified
	await prisma.userEmailVerificationToken.update({
		data: { verified: true },
		where: { email, otp },
	});

	// hash user password here -------------------------------------
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hashSync(password, salt);

	// create the user
	try {
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword, username },
			select: { email: true, username: true, id: true },
		});
		res.status(201).json(<SuccessResponse<any>>{
			ok: true,
			message: "Registreation successful",
			data: newUser,
		});
	} catch (error) {
		res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error,
		});
	}
};

export const handleLogin = async (req: Request, res: Response) => {
	const safe = loginInputSchema.safeParse(req.body);
	if (!safe.success)
		return res.status(400).json(<ErrorResponse<typeof safe.error>>{
			ok: false,
			error: {
				message: safe.error.issues.map((d) => d.message).join(", "),
				details: safe.error,
			},
		});

	const { email, password } = safe.data;

	const user = await prisma.user.findFirst({
		where: { email },
		select: { id: true, username: true, email: true, password: true },
	});

	if (!user)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Incorrect email" },
		});

	const authorised = await bcrypt.compareSync(password, user.password);

	if (!authorised)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Incorrect password" },
		});

	const token = jwt.sign({ email }, process.env.HASH_SECRET + "");
	const { password: pass, ...userData } = user;
	res.status(200).json(<SuccessResponse<typeof userData>>{
		ok: true,
		message: "Login successful",
		data: {
			...userData,
			UserAccessToken: token,
		},
	});
};

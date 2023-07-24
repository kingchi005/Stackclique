import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../../prisma";
import { ErrorResponse, SuccessResponse } from "../types";
import textflow from "textflow.js";
import {
	emailSchema,
	phoneNumberSchema,
	emailSignupInputSchema,
	phoneSignupInputSchema,
	loginEmailSchema,
	loginPhoneSchema,
} from "../zodSchema/inputSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "./../../env";
import { sendEmail, sendTestMail } from "./mailcontroller";

textflow.useKey(env.TEXTFLOW_API_KEY);

export const sendOTPSMS = async (req: Request, res: Response) => {
	const safe = z
		.object({ phone_number: phoneNumberSchema })
		.safeParse(req.params);
	if (!safe.success)
		return res.status(401).json(<ErrorResponse<typeof safe.error>>{
			ok: false,
			error: {
				message: safe.error.issues.map((d) => d.message).join(", "),
				details: safe.error,
			},
		});

	const { phone_number } = safe.data;
	const existingUser = await prisma.user.findFirst({
		where: { phone_number },
	});

	if (existingUser)
		return res.status(202).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Your phone number is already verified" },
		});

	// for textflow verification
	const textflowRes = await textflow.sendVerificationSMS(phone_number, {
		service_name: "Stack clique",
	});
	if (textflowRes == undefined)
		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "An error occored" },
		});

	if (!textflowRes.ok)
		return res.status(400).json(<ErrorResponse<any>>{
			ok: false,
			error: {
				message: textflowRes.message,
				details: { expires: textflowRes.data?.expires },
			},
		});

	return res.status(200).json(<SuccessResponse<typeof textflowRes.data>>{
		ok: true,
		message: textflowRes.message,
		data: textflowRes.data,
	});
};

export const sendOTPEmail = async (req: Request, res: Response) => {
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

	const emailIsExisting = await prisma.user.findFirst({
		where: { email },
	});

	if (emailIsExisting)
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
		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "An error occored please try after few minutes" },
		});
	}

	// send email with OTP---------------------------------------
	const EMAIL_MESSAGE = `<p>Your Stack Clique verification code is <b>${OTP}</b></p><p>This code will expire after <i>10 minutes</i></p>`;
	// if email sent
	const emailResponse = await sendEmail(
		email,
		EMAIL_MESSAGE,
		"STACK CLIQUE EMAIL VERIFICATION"
	);

	if (!emailResponse.success)
		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: {
				message: "An error occored and email was not sent",
				details: emailResponse.details,
			},
		});

	return res.status(200).json(<SuccessResponse<any>>{
		ok: true,
		data: emailResponse.details,
		message: emailResponse.message,
	});
};

export const handleSignupByPhone = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const isByPhone = req.query.phone;
	if (!isByPhone) return next();

	const safeInput = phoneSignupInputSchema.safeParse(req.body);
	if (!safeInput.success)
		return res.status(400).json(<ErrorResponse<typeof safeInput.error>>{
			ok: false,
			error: {
				message: safeInput.error.issues.map((d) => d.message).join(", "),
				details: safeInput.error,
			},
		});

	const { phone_number, otp, password, username } = safeInput.data;

	// check if user already exists-------------------------
	const existingUser = await prisma.user.findFirst({ where: { phone_number } });
	if (existingUser)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: `User with email '${phone_number}' already exists` },
		});

	// verify phone number-------------
	const verificationReseponse = await textflow.verifyCode(
		phone_number,
		"" + otp
	);

	if (verificationReseponse == undefined)
		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "An error occored" },
		});

	if (!verificationReseponse.valid)
		return res.status(400).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: verificationReseponse.message },
		});

	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hashSync(password, salt);

	// create the user
	try {
		const newUser = await prisma.user.create({
			data: { phone_number, password: hashedPassword, username },
			select: { email: true, username: true, id: true },
		});

		return res.status(201).json(<SuccessResponse<any>>{
			ok: true,
			message: "Registreation successful",
			data: newUser,
		});
	} catch (error) {
		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { details: error, message: "An error occoured please try again" },
		});
	}

	res.json({ msg: "success", result: verificationReseponse });
};

export const handleSignupByEmail = async (req: Request, res: Response) => {
	// validate user input
	const safe = emailSignupInputSchema.safeParse(req.body);
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
		return res.status(201).json(<SuccessResponse<any>>{
			ok: true,
			message: "Registreation successful",
			data: newUser,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { details: error, message: "An error occoured please try again" },
		});
	}
};

export const handleLogin = async (req: Request, res: Response) => {
	if (!req.body.email && !req.body.phone_number)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "please provide email or phone number" },
		});

	if (req.body.email) {
		const safeInput = loginEmailSchema.safeParse(req.body);

		if (!safeInput.success)
			return res.status(401).json(<ErrorResponse<typeof safeInput.error>>{
				ok: false,
				error: {
					message: safeInput.error.issues.map((d) => d.message).join(", "),
					details: safeInput.error,
				},
			});

		// login with email
		const { email, password } = safeInput.data;

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

		const token = jwt.sign({ email }, env.HASH_SECRET + "");
		const { password: pass, ...userData } = user;
		return res.status(200).json(<SuccessResponse<typeof userData>>{
			ok: true,
			message: "Login successful",
			data: {
				...userData,
				UserAccessToken: token,
			},
		});
	}

	const safeInput = loginPhoneSchema.safeParse(req.body);

	if (!safeInput.success)
		return res.status(400).json(<ErrorResponse<typeof safeInput.error>>{
			ok: false,
			error: {
				message: safeInput.error.issues.map((d) => d.message).join(", "),
				details: safeInput.error,
			},
		});

	// login with phone number
	const { phone_number, password } = safeInput.data;

	const user = await prisma.user.findFirst({
		where: { phone_number },
		select: { id: true, username: true, phone_number: true, password: true },
	});

	if (!user)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Incorrect phone_number" },
		});

	const authorised = await bcrypt.compareSync(password, user.password);

	if (!authorised)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Incorrect password" },
		});

	const token = jwt.sign({ phone_number }, env.HASH_SECRET + "");
	const { password: pass, ...userData } = user;
	return res.status(200).json(<SuccessResponse<typeof userData>>{
		ok: true,
		message: "Login successful",
		data: {
			...userData,
			UserAccessToken: token,
		},
	});
};

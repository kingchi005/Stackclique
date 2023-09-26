import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../prisma";
import { SuccessResponse } from "../types";
import {
	emailSchema,
	emailSignupInputSchema,
	loginEmailSchema,
} from "../validation/inputSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "./../../env";
import { sendEmail } from "./mailcontroller";
import AppError from "./AppError";
import { resCode } from "./errorController";

export const sendOTPEmail = async (req: Request, res: Response) => {
	const safe = z.object({ email: emailSchema }).safeParse(req.params);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { email } = safe.data;

	const emailIsExisting = await prisma.user.findFirst({
		where: { email },
	});

	if (emailIsExisting)
		throw new AppError("Your email is already verified", resCode.CONFLICT);

	const OTP = (() => Math.floor(Math.random() * 900000) + 100000)();

	try {
		const generatedUserOTP = await prisma.userEmailVerificationToken.upsert({
			where: { email },
			update: {
				otp: OTP,
				expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
			},
			create: {
				email,
				otp: OTP,
				expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
			},
		});
	} catch (error) {
		throw new AppError(
			"An error occored please try after few minutes",
			resCode.INTERNAL_SERVER_ERROR,
			error
		);
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
		throw new AppError(
			"An error occored and email was not sent",
			resCode.INTERNAL_SERVER_ERROR,
			emailResponse.details
		);

	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: {},
		message: emailResponse.message,
	});
};

export const handleSignupByEmail = async (req: Request, res: Response) => {
	// validate user input
	const safe = emailSignupInputSchema.safeParse(req.body);
	if (!safe.success)
		throw new AppError(
			safe.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safe.error
		);

	const { email, otp, password, username } = safe.data;

	// check if user already exists-------------------------
	const existingEmail = await prisma.user.findFirst({ where: { email } });
	if (existingEmail)
		throw new AppError(
			`User with email '${email}' already exists`,
			resCode.CONFLICT
		);

	const existingUsername = await prisma.user.findFirst({ where: { username } });
	if (existingUsername)
		throw new AppError(
			`User with user name '${username}' already exists`,
			resCode.CONFLICT
		);

	// verify email using OTP
	const foundOTP = await prisma.userEmailVerificationToken.findUnique({
		where: { email, otp },
	});

	if (!foundOTP)
		throw new AppError("Incorrect OTP or email", resCode.UNAUTHORIZED);

	if (foundOTP.verified)
		throw new AppError("Your email is already verified", resCode.CONFLICT);

	if (foundOTP.expiredAt < new Date())
		throw new AppError("OTP has expired", resCode.NOT_ACCEPTED);

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
		return res.status(resCode.CREATED).json(<SuccessResponse<any>>{
			ok: true,
			message: "Registreation successful",
			data: newUser,
		});
	} catch (error) {
		throw new AppError("An error occoured please try again", 500, error);
	}
};

export const handleLogin = async (req: Request, res: Response) => {
	const safeInput = loginEmailSchema.safeParse(req.body);

	if (!safeInput.success)
		throw new AppError(
			safeInput.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeInput.error
		);

	// login with email
	const { email, password } = safeInput.data;

	const user = await prisma.user.findFirst({
		where: { email },
		select: { id: true, username: true, email: true, password: true },
	});

	if (!user) throw new AppError("Incorrect email", resCode.UNAUTHORIZED);

	const authorised = await bcrypt.compareSync(password, user.password);

	if (!authorised) throw new AppError("Incorrect password", 401);

	const token = jwt.sign(
		{ id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
		env.HASH_SECRET + ""
	);
	const { password: pass, ...userData } = user;
	return res.status(resCode.ACCEPTED).json(<SuccessResponse<typeof userData>>{
		ok: true,
		message: "Login successful",
		data: {
			...userData,
			UserAccessToken: token,
		},
	});

	// const safeInput = loginPhoneSchema.safeParse(req.body);

	// if (!safeInput.success)
	// 	return res.status(400).json(<ErrorResponse<typeof safeInput.error>>{
	// 		ok: false,
	// 		error: {
	// 			message: safeInput.error.issues.map((d) => d.message).join(", "),
	// 			details: safeInput.error,
	// 		},
	// 	});

	// // login with phone number
	// const { phone_number, password } = safeInput.data;

	// const user = await prisma.user.findFirst({
	// 	where: { phone_number },
	// 	select: { id: true, username: true, phone_number: true, password: true },
	// });

	// if (!user)
	// 	return res.status(401).json(<ErrorResponse<any>>{
	// 		ok: false,
	// 		error: { message: "Incorrect phone_number" },
	// 	});

	// const authorised = await bcrypt.compareSync(password, user.password);

	// if (!authorised)
	// 	return res.status(401).json(<ErrorResponse<any>>{
	// 		ok: false,
	// 		error: { message: "Incorrect password" },
	// 	});

	// const token = jwt.sign({ id: user.id }, env.HASH_SECRET + "");
	// const { password: pass, ...userData } = user;
	// return res.status(200).json(<SuccessResponse<typeof userData>>{
	// 	ok: true,
	// 	message: "Login successful",
	// 	data: {
	// 		...userData,
	// 		UserAccessToken: token,
	// 	},
	// });
};

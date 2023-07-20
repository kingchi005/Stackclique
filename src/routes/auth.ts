import { Router, Request, Response } from "express";
import { emailSchema, signupInputSchema } from "../zodSchema/inputSchema";
import { ErrorResponse, SuccessResponse } from "../types";
import { z } from "zod";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import { transporter } from "../controllers/mailcontroller";

const authRouter = Router();

authRouter.get(
	"/send-verification/:email",
	async (req: Request, res: Response) => {
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
		const OTP = (() => Math.floor(Math.random() * 9000) + 1000)();

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

		// send email with OTP---------------------------------------
		// transporter.sendMail
		// if email sent

		res.status(200).json(<SuccessResponse<any>>{
			ok: true,
			data: {},
			message: `Email was sent to '${email}'. Please check you email`,
		});
	}
);

authRouter.post("/signup", async (req: Request, res: Response) => {
	// validate user input
	const safe = signupInputSchema.safeParse(req.body);
	if (!safe.success)
		return res.status(201).json(<ErrorResponse<typeof safe.error>>{
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
		return res.status(400).json(<ErrorResponse<any>>{
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
		res.status(200).json(<SuccessResponse<any>>{
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
});

export default authRouter;

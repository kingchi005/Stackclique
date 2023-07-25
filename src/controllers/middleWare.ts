import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "../types";
import { bearerTokenSchema } from "../zodSchema/inputSchema";
import prisma from "../../prisma";
import env from "../../env";

export const secureRoute = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const isValid = bearerTokenSchema.safeParse(req.headers.authorization);

	if (!isValid.success)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Invalid API key" },
		});

	const providedToken = isValid.data.split(" ")?.[1]?.trim();

	if (!providedToken)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Invalid API key" },
		});

	let id = "";

	try {
		id = jwt.verify(providedToken, env.HASH_SECRET) as string;
	} catch (error: any) {
		// console.log(error.message);
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Invalid API key", details: error },
		});
	}

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			completed_course_modules: true,
			level: true,
			email: true,
			phone_number: true,
			// notification:true ,
			username: true,
			profile_photo: true,
			cover_photo: true,
			enrolled_courses: true,
		},
	});
	//
	if (!user)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Not a user" },
		});

	res.locals.user_id = user.id;

	next();
};

(() => {
	// const token = jwt.sign(
	// 	"aa3fe03a-e9e7-41da-b674-f3a69d6feebc",
	// 	env.HASH_SECRET
	// );
	// console.log(token);
})();

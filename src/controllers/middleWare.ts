import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { bearerTokenSchema } from "../zodSchema/inputSchema";
import prisma from "../../prisma";
import env from "../../env";
import AppError from "./AppError";
import { UNAUTHORIZED } from "./errorController";

const isValidToken = (obj: unknown): obj is { id: string } & jwt.JwtPayload =>
	obj !== null && typeof obj == "object" && "id" in obj;

const hasExpired = (exp: number) => exp * 1000 < new Date().getTime();

export const secureRoute = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const isValid = bearerTokenSchema.safeParse(req.headers.authorization);

		if (!isValid.success)
			throw new AppError("Please provide an API key", UNAUTHORIZED.code);

		const providedToken = isValid.data.split(" ")?.[1]?.trim();

		if (!providedToken)
			throw new AppError("Invalid API key", UNAUTHORIZED.code);

		const veriedToken: unknown = jwt.verify(providedToken, env.HASH_SECRET);

		if (!isValidToken(veriedToken))
			throw new AppError("Invalid API key", UNAUTHORIZED.code);

		const { id, exp } = veriedToken;

		if (exp && hasExpired(exp))
			throw new AppError("API key has expired", UNAUTHORIZED.code);

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				username: true,
				profile_photo: true,
				cover_photo: true,
				level: true,
				notifications: true,
				enrolled_courses: {
					select: {
						course: {
							select: {
								id: true,
								title: true,
								reviews: true,
								_count: { select: { enrollement: {}, reviews: {} } },
								profile_photo: true,
							},
						},
						enrolled_at: true,
					},
				},
				created_at: true,
			},
		});
		//
		if (!user) throw new AppError("Invalid API key", UNAUTHORIZED.code);

		res.locals.user_id = user?.id;

		next();
	} catch (err) {
		next(err);
	}
};

(() => {
	// const token = jwt.sign(
	// 	"aa3fe03a-e9e7-41da-b674-f3a69d6feebc",
	// 	env.HASH_SECRET
	// );
	// console.log(token);
})();

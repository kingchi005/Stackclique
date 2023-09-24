import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { bearerTokenSchema } from "../validation/inputSchema";
import prisma from "../../prisma";
import env from "../../env";
import AppError from "./AppError";
import { userRole } from "../types";
import { errCodeEnum } from "./errorController";

export const isValidToken = (
	obj: unknown
): obj is { id: string } & jwt.JwtPayload =>
	obj !== null && typeof obj == "object" && "id" in obj;

export const hasExpired = (exp: number) => exp * 1000 < new Date().getTime();

export const onlyAdmins = (req: Request, res: Response, next: NextFunction) => {
	try {
		const userRole: userRole = res.locals.user_role;
		if (userRole !== "Admin")
			throw new AppError("You are not an Admin", errCodeEnum.UNAUTHORIZED);
		else next();
	} catch (err) {
		next(err);
	}
};

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const isValid = bearerTokenSchema.safeParse(req.headers.authorization);

		if (!isValid.success)
			throw new AppError("Please provide an API key", errCodeEnum.UNAUTHORIZED);

		const providedToken = isValid.data.split(" ")?.[1]?.trim();

		if (!providedToken)
			throw new AppError("Invalid API key", errCodeEnum.UNAUTHORIZED);

		const veriedToken: unknown = jwt.verify(providedToken, env.HASH_SECRET);

		if (!isValidToken(veriedToken))
			throw new AppError("Invalid API key", errCodeEnum.UNAUTHORIZED);

		const { id, exp } = veriedToken;

		if (exp && hasExpired(exp))
			throw new AppError("API key has expired", errCodeEnum.UNAUTHORIZED);

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
				role: true,
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
		if (!user) throw new AppError("Invalid API key", errCodeEnum.UNAUTHORIZED);

		res.locals.user_id = user.id;
		res.locals.user_role = user.role;

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

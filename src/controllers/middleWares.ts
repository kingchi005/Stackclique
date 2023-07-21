import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { bearerTokenSchema } from "../zodSchema/inputSchema";
import { ErrorResponse } from "../types";

export const anthenticUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const valid = z
		.object({ authorization: bearerTokenSchema })
		.safeParse(req.headers);

	if (!valid.success)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Unauthorised" },
		});

	const { authorization } = valid.data;

	const token: any = jwt.decode(authorization);
	console.log(token);
	next();
};

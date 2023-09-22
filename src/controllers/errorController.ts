import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";
import AppError from "./AppError";
import { JsonWebTokenError } from "jsonwebtoken";

export const errCodeEnum = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTED: 406,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
};

export const errMsgEnum = {
	OK: "OK",
	CREATED: "Created",
	ACCEPTED: "Accepted",
	NO_CONTENT: "No Content",
	BAD_REQUEST: "Bad Request",
	UNAUTHORIZED: "Unauthorized",
	FORBIDDEN: "Forbidden",
	NOT_FOUND: "Not Found",
	METHOD_NOT_ALLOWED: "Method Not Allowed",
	NOT_ACCEPTED: "Not Accepted",
	CONFLICT: "Conflict",
	INTERNAL_SERVER_ERROR: "Internal Server Error",
	BAD_GATEWAY: "Bad Gateway",
	SERVICE_UNAVAILABLE: "Service Unavailable",
	GATEWAY_TIMEOUT: "Gateway Timeout",
};

export default function errorController(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log(error);
	if (error instanceof AppError)
		return res.status(error.statusCode).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: error.message, details: error.details },
		});

	if (error instanceof JsonWebTokenError)
		return res.status(errCodeEnum.UNAUTHORIZED).json(<
			ErrorResponse<typeof error>
		>{
			ok: false,
			error: {
				message: "Invalid API key",
				details: error,
			},
		});

	return res.status(errCodeEnum.INTERNAL_SERVER_ERROR).json(<
		ErrorResponse<any>
	>{
		ok: false,
		error: {
			message: "Something went wrong",
			details: error,
		},
	});
}

export const tryCatchWapper =
	(
		controller: (
			req: Request,
			res: Response
		) => Promise<Response<any, Record<string, any>>>
	) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res);
		} catch (error) {
			return next(error);
		}
	};

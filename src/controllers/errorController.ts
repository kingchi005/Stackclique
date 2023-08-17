import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";
import AppError from "./AppError";

export const OK = { code: 200, message: "OK" };
export const CREATED = { code: 201, message: "Created" };
export const ACCEPTED = { code: 202, message: "Accepted" };
export const NO_CONTENT = { code: 204, message: "No Content" };

export const BAD_REQUEST = { code: 400, message: "Bad Request" };
export const UNAUTHORIZED = { code: 401, message: "Unauthorized" };
export const FORBIDDEN = { code: 403, message: "Forbidden" };
export const NOT_FOUND = { code: 404, message: "Not Found" };
export const METHOD_NOT_ALLOWED = { code: 405, message: "Method Not Allowed" };
export const NOT_ACCEPTED = { code: 406, message: "Not Accepted" };
export const CONFLICT = { code: 409, message: "Conflict" };
export const INTERNAL_SERVER_ERROR = {
	code: 500,
	message: "Internal Server Error",
};
export const BAD_GATEWAY = { code: 502, message: "Bad Gateway" };
export const SERVICE_UNAVAILABLE = {
	code: 503,
	message: "Service Unavailable",
};
export const GATEWAY_TIMEOUT = { code: 504, message: "Gateway Timeout" };

export default function errorController(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (error instanceof AppError) {
		console.log(error);
		return res.status(error.statusCode).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: error.message, details: error.details },
		});
	}

	return res.status(INTERNAL_SERVER_ERROR.code).json(<ErrorResponse<any>>{
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

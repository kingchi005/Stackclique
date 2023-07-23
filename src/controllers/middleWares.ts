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
// for textflow verification
//User has sent his phone number for verification
/* textflow.sendVerificationSMS("+11234567890", verificationOptions);

//Show him the code submission form

//The user has submitted the code
let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE"); 
if(result.valid)
    console.log("Verified!"); */

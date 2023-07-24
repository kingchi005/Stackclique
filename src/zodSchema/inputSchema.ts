import { z } from "zod";

export const userInputSchema = z.string({
	invalid_type_error: "'id' must be a stirng",
});

const usernameSchema = z
	.string({
		required_error: "username is required",
		invalid_type_error: "'name' must be a string",
	})
	.min(3, { message: "'username' must be 3 ore more characters" });

export const emailSchema = z
	.string({ required_error: "Email is required" })
	.email({ message: "Provide a valid email" });

export const phoneNumberSchema = z
	.string()
	.regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
	.min(7, { message: "Invalid phone number" })
	.max(14, { message: "Invalid phone number" })
	.transform((v) => v.replace(/\s/g, ""));

const otpSchema = z
	.number({
		invalid_type_error: "'OTP' must be a number",
		required_error: "OTP is required",
	})
	.min(4, { message: "'OTP' should be 4 digits" });

const passwordSchema = z
	.string({ required_error: "'password' is required" })
	.min(6, { message: "'password' must be 6 ore more characters" });

export const bearerTokenSchema = z.string({
	required_error: "'Token' is required",
	invalid_type_error: "'Token' must be a string",
});

// export const

// input schemas

export const createUserSchema = z.object({
	username: usernameSchema,
	email: emailSchema,
});

export const emailSignupInputSchema = z.object({
	email: emailSchema,
	otp: otpSchema,
	username: usernameSchema,
	password: passwordSchema,
});

export const phoneSignupInputSchema = z.object({
	phone_number: phoneNumberSchema,
	otp: otpSchema,
	username: usernameSchema,
	password: passwordSchema,
});

export const loginEmailSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const loginPhoneSchema = z.object({
	phone_number: phoneNumberSchema,
	password: passwordSchema,
});

import { z } from "zod";

// helpers functions
const getStringValidation = (key: string) =>
	z
		.string({
			required_error: `'${key}' is required`,
			invalid_type_error: `'${key}' must be a string`,
		})
		.min(3, { message: `'${key}' must be 3 or more characters` });

const getNumberValidation = (key: string) =>
	z.number({
		required_error: `'${key}' is required`,
		invalid_type_error: `'${key}' must be a number`,
	});

// single schemas
export const userInputSchema = z.string({
	invalid_type_error: "'id' must be a stirng",
});

const usernameSchema = z
	.string({
		required_error: "username is required",
		invalid_type_error: "'name' must be a string",
	})
	.min(3, { message: "'username' must be 3 or more characters" });

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
	.string({
		invalid_type_error: "'OTP' must be a number",
		required_error: "OTP is required",
	})
	.min(4, { message: "'OTP' should at least be 4 digits" })
	.transform((v) => +v);

const passwordSchema = z
	.string({ required_error: "'password' is required" })
	.min(6, { message: "'password' must be 6 or more characters" });

export const bearerTokenSchema = z.string({
	required_error: "'Authorisation' is required",
	invalid_type_error: "'Authorisation' must be a string",
});

export const idParamSchema = z.object({ id: z.string() });

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

export const createChannelSchema = z.object({
	name: getStringValidation("name"),
	description: getStringValidation("description"),
	required_user_level: getNumberValidation("required_user_level"),
});

export const addUserToChannelSchema = z.object({
	userId: getStringValidation("userId"),
	id: getStringValidation("channelId"),
});

export const sendChatMessageSchema = z.object({
	message: getStringValidation("message"),
	channel_id: getStringValidation("channel_id"),
	sender_id: getStringValidation("sender_id"),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChatMessageSchema = exports.addUserToChannelSchema = exports.createChannelSchema = exports.loginPhoneSchema = exports.loginEmailSchema = exports.phoneSignupInputSchema = exports.emailSignupInputSchema = exports.createUserSchema = exports.idParamSchema = exports.bearerTokenSchema = exports.phoneNumberSchema = exports.emailSchema = exports.userInputSchema = void 0;
const zod_1 = require("zod");
const getStringValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` });
const getNumberValidation = (key) => zod_1.z.number({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a number`,
});
exports.userInputSchema = zod_1.z.string({
    invalid_type_error: "'id' must be a stirng",
});
const usernameSchema = zod_1.z
    .string({
    required_error: "username is required",
    invalid_type_error: "'name' must be a string",
})
    .min(3, { message: "'username' must be 3 or more characters" });
exports.emailSchema = zod_1.z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide a valid email" });
exports.phoneNumberSchema = zod_1.z
    .string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
    .min(7, { message: "Invalid phone number" })
    .max(14, { message: "Invalid phone number" })
    .transform((v) => v.replace(/\s/g, ""));
const otpSchema = zod_1.z
    .string({
    invalid_type_error: "'OTP' must be a number",
    required_error: "OTP is required",
})
    .min(4, { message: "'OTP' should at least be 4 digits" })
    .transform((v) => +v);
const passwordSchema = zod_1.z
    .string({ required_error: "'password' is required" })
    .min(6, { message: "'password' must be 6 or more characters" });
exports.bearerTokenSchema = zod_1.z.string({
    required_error: "'Authorisation' is required",
    invalid_type_error: "'Authorisation' must be a string",
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.string() });
exports.createUserSchema = zod_1.z.object({
    username: usernameSchema,
    email: exports.emailSchema,
});
exports.emailSignupInputSchema = zod_1.z.object({
    email: exports.emailSchema,
    otp: otpSchema,
    username: usernameSchema,
    password: passwordSchema,
});
exports.phoneSignupInputSchema = zod_1.z.object({
    phone_number: exports.phoneNumberSchema,
    otp: otpSchema,
    username: usernameSchema,
    password: passwordSchema,
});
exports.loginEmailSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: passwordSchema,
});
exports.loginPhoneSchema = zod_1.z.object({
    phone_number: exports.phoneNumberSchema,
    password: passwordSchema,
});
exports.createChannelSchema = zod_1.z.object({
    name: getStringValidation("name"),
    required_user_level: getNumberValidation("required_user_level"),
});
exports.addUserToChannelSchema = zod_1.z.object({});
exports.sendChatMessageSchema = zod_1.z.object({
    message: getStringValidation("message"),
    channel_id: getStringValidation("channel_id"),
    sender_id: getStringValidation("sender_id"),
});
//# sourceMappingURL=inputSchema.js.map
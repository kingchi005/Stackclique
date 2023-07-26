"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPhoneSchema = exports.loginEmailSchema = exports.phoneSignupInputSchema = exports.emailSignupInputSchema = exports.createUserSchema = exports.bearerTokenSchema = exports.phoneNumberSchema = exports.emailSchema = exports.userInputSchema = void 0;
const zod_1 = require("zod");
exports.userInputSchema = zod_1.z.string({
    invalid_type_error: "'id' must be a stirng",
});
const usernameSchema = zod_1.z
    .string({
    required_error: "username is required",
    invalid_type_error: "'name' must be a string",
})
    .min(3, { message: "'username' must be 3 ore more characters" });
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
    .min(6, { message: "'password' must be 6 ore more characters" });
exports.bearerTokenSchema = zod_1.z.string({
    required_error: "'Authorisation' is required",
    invalid_type_error: "'Authorisation' must be a string",
});
// export const
// input schemas
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
//# sourceMappingURL=inputSchema.js.map
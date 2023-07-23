"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInputSchema = exports.signupInputSchema = exports.createUserSchema = exports.bearerTokenSchema = exports.emailSchema = exports.userInputSchema = void 0;
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
const otpSchema = zod_1.z
    .number({
    invalid_type_error: "'OTP' must be a number",
    required_error: "OTP is required",
})
    .min(4, { message: "'OTP' should be 4 digits" });
const passwordSchema = zod_1.z
    .string({ required_error: "'password' is required" })
    .min(6, { message: "'password' must be 6 ore more characters" });
exports.bearerTokenSchema = zod_1.z.string({
    required_error: "'Token' is required",
    invalid_type_error: "'Token' must be a string",
});
// input schemas
exports.createUserSchema = zod_1.z.object({
    username: usernameSchema,
    email: exports.emailSchema,
});
exports.signupInputSchema = zod_1.z.object({
    email: exports.emailSchema,
    otp: otpSchema,
    username: usernameSchema,
    password: passwordSchema,
});
exports.loginInputSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: passwordSchema,
});
//# sourceMappingURL=inputSchema.js.map
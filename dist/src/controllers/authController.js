"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = exports.handleSignupByEmail = exports.handleSignupByPhone = exports.sendOTPEmail = exports.sendOTPSMS = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../prisma"));
const inputSchema_1 = require("../zodSchema/inputSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("./../../env"));
const mailcontroller_1 = require("./mailcontroller");
const AppError_1 = __importDefault(require("./AppError"));
const errorController_1 = require("./errorController");
const sendOTPSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.sendOTPSMS = sendOTPSMS;
const sendOTPEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z.object({ email: inputSchema_1.emailSchema }).safeParse(req.params);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), errorController_1.BAD_REQUEST.code, safe.error);
    const { email } = safe.data;
    const emailIsExisting = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (emailIsExisting)
        throw new AppError_1.default("Your email is already verified", errorController_1.CONFLICT.code);
    const OTP = (() => Math.floor(Math.random() * 900000) + 100000)();
    try {
        const generatedUserOTP = yield prisma_1.default.userEmailVerificationToken.upsert({
            where: { email },
            update: {
                otp: OTP,
                expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
            },
            create: {
                email,
                otp: OTP,
                expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
            },
        });
    }
    catch (error) {
        throw new AppError_1.default("An error occored please try after few minutes", errorController_1.INTERNAL_SERVER_ERROR.code, error);
    }
    const EMAIL_MESSAGE = `<p>Your Stack Clique verification code is <b>${OTP}</b></p><p>This code will expire after <i>10 minutes</i></p>`;
    const emailResponse = yield (0, mailcontroller_1.sendEmail)(email, EMAIL_MESSAGE, "STACK CLIQUE EMAIL VERIFICATION");
    if (!emailResponse.success)
        throw new AppError_1.default("An error occored and email was not sent", errorController_1.INTERNAL_SERVER_ERROR.code, emailResponse.details);
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: {},
        message: emailResponse.message,
    });
});
exports.sendOTPEmail = sendOTPEmail;
const handleSignupByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.handleSignupByPhone = handleSignupByPhone;
const handleSignupByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = inputSchema_1.emailSignupInputSchema.safeParse(req.body);
    if (!safe.success)
        throw new AppError_1.default(safe.error.issues.map((d) => d.message).join(", "), errorController_1.BAD_REQUEST.code, safe.error);
    const { email, otp, password, username } = safe.data;
    const existingEmail = yield prisma_1.default.user.findFirst({ where: { email } });
    if (existingEmail)
        throw new AppError_1.default(`User with email '${email}' already exists`, errorController_1.CONFLICT.code);
    const existingUsername = yield prisma_1.default.user.findFirst({ where: { username } });
    if (existingUsername)
        throw new AppError_1.default(`User with user name '${username}' already exists`, errorController_1.CONFLICT.code);
    const foundOTP = yield prisma_1.default.userEmailVerificationToken.findUnique({
        where: { email, otp },
    });
    if (!foundOTP)
        throw new AppError_1.default("Incorrect OTP or email", errorController_1.UNAUTHORIZED.code);
    if (foundOTP.verified)
        throw new AppError_1.default("Your email is already verified", errorController_1.CONFLICT.code);
    if (foundOTP.expiredAt < new Date())
        throw new AppError_1.default("OTP has expired", errorController_1.NOT_ACCEPTED.code);
    yield prisma_1.default.userEmailVerificationToken.update({
        data: { verified: true },
        where: { email, otp },
    });
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = yield bcrypt_1.default.hashSync(password, salt);
    try {
        const newUser = yield prisma_1.default.user.create({
            data: { email, password: hashedPassword, username },
            select: { email: true, username: true, id: true },
        });
        return res.status(errorController_1.CREATED.code).json({
            ok: true,
            message: "Registreation successful",
            data: newUser,
        });
    }
    catch (error) {
        throw new AppError_1.default("An error occoured please try again", 500, error);
    }
});
exports.handleSignupByEmail = handleSignupByEmail;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInput = inputSchema_1.loginEmailSchema.safeParse(req.body);
    if (!safeInput.success)
        throw new AppError_1.default(safeInput.error.issues.map((d) => d.message).join(", "), errorController_1.BAD_REQUEST.code, safeInput.error);
    const { email, password } = safeInput.data;
    const user = yield prisma_1.default.user.findFirst({
        where: { email },
        select: { id: true, username: true, email: true, password: true },
    });
    if (!user)
        throw new AppError_1.default("Incorrect email", errorController_1.UNAUTHORIZED.code);
    const authorised = yield bcrypt_1.default.compareSync(password, user.password);
    if (!authorised)
        throw new AppError_1.default("Incorrect password", 401);
    const token = jsonwebtoken_1.default.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, env_1.default.HASH_SECRET + "");
    const { password: pass } = user, userData = __rest(user, ["password"]);
    return res.status(errorController_1.ACCEPTED.code).json({
        ok: true,
        message: "Login successful",
        data: Object.assign(Object.assign({}, userData), { UserAccessToken: token }),
    });
});
exports.handleLogin = handleLogin;
//# sourceMappingURL=authController.js.map
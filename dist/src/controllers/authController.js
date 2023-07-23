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
exports.handleLogin = exports.handleSignup = exports.requestVerificationEmail = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../prisma"));
const inputSchema_1 = require("../zodSchema/inputSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("./../../env"));
const requestVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z.object({ email: inputSchema_1.emailSchema }).safeParse(req.params);
    if (!safe.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safe.error.issues.map((d) => d.message).join(", "),
                details: safe.error,
            },
        });
    const { email } = safe.data;
    const alreadyVerified = yield prisma_1.default.userEmailVerificationToken.findFirst({
        where: { email, verified: true },
    });
    if (alreadyVerified)
        return res.status(202).json({
            ok: false,
            error: { message: "Your email is already verified" },
        });
    const OTP = (() => Math.floor(Math.random() * 9000) + 1000)();
    try {
        const generatedUserOTP = yield prisma_1.default.userEmailVerificationToken.upsert({
            where: { email, verified: false },
            update: {
                otp: OTP,
                expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
            },
            create: {
                email,
                otp: OTP,
                expiredAt: new Date(new Date().getTime() + 60 * 60 * 1000),
            },
            select: { email: true, otp: true, expiredAt: true },
        });
    }
    catch (error) {
        console.log(error);
    }
    // send email with OTP---------------------------------------
    // transporter.sendMail
    // if email sent
    res.status(200).json({
        ok: true,
        data: {},
        message: `Email was sent to '${email}'. Please check you email`,
    });
});
exports.requestVerificationEmail = requestVerificationEmail;
const handleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate user input
    const safe = inputSchema_1.signupInputSchema.safeParse(req.body);
    if (!safe.success)
        return res.status(400).json({
            ok: false,
            error: {
                message: safe.error.issues.map((d) => d.message).join(", "),
                details: safe.error,
            },
        });
    const { email, otp, password, username } = safe.data;
    // check if user already exists-------------------------
    const existingUser = yield prisma_1.default.user.findFirst({ where: { email } });
    if (existingUser)
        return res.status(401).json({
            ok: false,
            error: { message: `User with email '${email}' already exists` },
        });
    // verify email using OTP
    const foundOTP = yield prisma_1.default.userEmailVerificationToken.findUnique({
        where: { email, otp, verified: false },
    });
    if (!foundOTP)
        return res.status(404).json({
            ok: false,
            error: { message: "Invalid OTP or email" },
        });
    if (foundOTP.expiredAt < new Date())
        return res.status(401).json({
            ok: false,
            error: { message: "OTP has expired" },
        });
    // user verified
    yield prisma_1.default.userEmailVerificationToken.update({
        data: { verified: true },
        where: { email, otp },
    });
    // hash user password here -------------------------------------
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = yield bcrypt_1.default.hashSync(password, salt);
    // create the user
    try {
        const newUser = yield prisma_1.default.user.create({
            data: { email, password: hashedPassword, username },
            select: { email: true, username: true, id: true },
        });
        res.status(201).json({
            ok: true,
            message: "Registreation successful",
            data: newUser,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error,
        });
    }
});
exports.handleSignup = handleSignup;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = inputSchema_1.loginInputSchema.safeParse(req.body);
    if (!safe.success)
        return res.status(400).json({
            ok: false,
            error: {
                message: safe.error.issues.map((d) => d.message).join(", "),
                details: safe.error,
            },
        });
    const { email, password } = safe.data;
    const user = yield prisma_1.default.user.findFirst({
        where: { email },
        select: { id: true, username: true, email: true, password: true },
    });
    if (!user)
        return res.status(401).json({
            ok: false,
            error: { message: "Incorrect email" },
        });
    const authorised = yield bcrypt_1.default.compareSync(password, user.password);
    if (!authorised)
        return res.status(401).json({
            ok: false,
            error: { message: "Incorrect password" },
        });
    const token = jsonwebtoken_1.default.sign({ email }, env_1.default.HASH_SECRET + "");
    const { password: pass } = user, userData = __rest(user, ["password"]);
    res.status(200).json({
        ok: true,
        message: "Login successful",
        data: Object.assign(Object.assign({}, userData), { UserAccessToken: token }),
    });
});
exports.handleLogin = handleLogin;
//# sourceMappingURL=authController.js.map
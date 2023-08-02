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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestMail = exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../../env"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_1.default.MAIL_USER,
        pass: env_1.default.MAIL_PASSWORD,
    },
});
const sendEmail = (to, message, subject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: "Stack Clique",
            to,
            subject,
            html: message,
        };
        const info = yield exports.transporter.sendMail(mailOptions);
        return {
            success: true,
            message: `Email sent to  ${info.envelope.to} `,
            details: info,
        };
    }
    catch (error) {
        console.log(error);
        return { success: false, details: error };
    }
});
exports.sendEmail = sendEmail;
const sendTestMail = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let testAccount = yield nodemailer_1.default.createTestAccount();
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        let info = yield transporter.sendMail({
            from: "Stack Clique",
            to,
            html: message,
        });
        console.log(info);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        return {
            success: true,
            message: `Email sent ${info.messageId} `,
            details: info,
        };
    }
    catch (error) {
        console.log(error);
        return { success: false, details: error };
    }
});
exports.sendTestMail = sendTestMail;
//# sourceMappingURL=mailcontroller.js.map
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
    // host: env.MAIL_HOST,
    service: "gmail",
    // port: 587,
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
            html: message, // plain text body
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
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    try {
        let testAccount = yield nodemailer_1.default.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass, // generated ethereal password
            },
        });
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: "Stack Clique",
            to,
            // subject: "Hello ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: message, // html body
        });
        console.log(info);
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
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
    // return info;
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
exports.sendTestMail = sendTestMail;
//# sourceMappingURL=mailcontroller.js.map
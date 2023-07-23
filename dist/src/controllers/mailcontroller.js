"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../../env"));
exports.transporter = nodemailer_1.default.createTransport({
    host: env_1.default.MAIL_HOST,
    port: 0,
    auth: {
        user: env_1.default.MAIL_USER,
        pass: env_1.default.MAIL_PASSWORD,
    },
});
//# sourceMappingURL=mailcontroller.js.map
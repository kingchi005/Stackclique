"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRouter = (0, express_1.Router)();
authRouter.get("/get-email-otp/:email", authController_1.sendOTPEmail);
authRouter.get("/get-sms-otp/:phone_number", authController_1.sendOTPSMS);
authRouter.post("/signup", authController_1.handleSignupByPhone, authController_1.handleSignupByEmail);
authRouter.post("/login", authController_1.handleLogin);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map
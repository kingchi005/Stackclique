"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const errorController_1 = require("../controllers/errorController");
const authRouter = (0, express_1.Router)();
authRouter.get("/get-email-otp/:email", (0, errorController_1.tryCatchWapper)(authController_1.sendOTPEmail));
authRouter.post("/signup-email", (0, errorController_1.tryCatchWapper)(authController_1.handleSignupByEmail));
authRouter.post("/login", (0, errorController_1.tryCatchWapper)(authController_1.handleLogin));
exports.default = authRouter;
//# sourceMappingURL=auth.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("~/controllers/authController");
const errorController_1 = require("~/controllers/errorController");
const authRoute = (0, express_1.Router)();
authRoute.get("/get-email-otp/:email", (0, errorController_1.tryCatchWapper)(authController_1.sendOTPEmail));
authRoute.post("/signup-email", (0, errorController_1.tryCatchWapper)(authController_1.handleSignupByEmail));
authRoute.post("/login", (0, errorController_1.tryCatchWapper)(authController_1.handleLogin));
exports.default = authRoute;
//# sourceMappingURL=auth.js.map
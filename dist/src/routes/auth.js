"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRouter = (0, express_1.Router)();
authRouter.get("/send-verification/:email", 
// anthenticUser,
authController_1.requestVerificationEmail);
authRouter.post("/signup", authController_1.handleSignup);
authRouter.post("/login", authController_1.handleLogin);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorController_1 = require("~/controllers/errorController");
const userController_1 = require("~/controllers/userController");
const userRoute = (0, express_1.Router)();
userRoute.get("/enrolled/:id", (0, errorController_1.tryCatchWapper)(userController_1.getErroledCourses));
userRoute.get("/:id", (0, errorController_1.tryCatchWapper)(userController_1.getUserDetails));
exports.default = userRoute;
//# sourceMappingURL=user.js.map
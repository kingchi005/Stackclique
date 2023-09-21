"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("~/controllers/courseController");
const errorController_1 = require("~/controllers/errorController");
const courseRoute = (0, express_1.Router)();
courseRoute.get("/", (0, errorController_1.tryCatchWapper)(courseController_1.getCourseByLimit));
courseRoute.get("/search", (0, errorController_1.tryCatchWapper)(courseController_1.searchCourse));
courseRoute.get("/:id", (0, errorController_1.tryCatchWapper)(courseController_1.getCourseDetails));
exports.default = courseRoute;
//# sourceMappingURL=courses.js.map
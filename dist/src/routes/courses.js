"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const courseRoute = (0, express_1.Router)();
courseRoute.get("/", courseController_1.getCourseByLimit);
courseRoute.get("/search", courseController_1.searchCourse);
courseRoute.get("/enrolled/:user_id", courseController_1.getErroledCourses);
courseRoute.get("/:id", courseController_1.getSingleCourse);
exports.default = courseRoute;
//# sourceMappingURL=courses.js.map
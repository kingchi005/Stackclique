import { Router } from "express";
import {
	getCourseByLimit,
	getErroledCourses,
	getSingleCourse,
	searchCourse,
} from "../controllers/courseController";

const courseRoute = Router();

courseRoute.get("/", getCourseByLimit);

courseRoute.get("/search", searchCourse);

courseRoute.get("/enrolled/:user_id", getErroledCourses);

courseRoute.get("/:id", getSingleCourse);

export default courseRoute;

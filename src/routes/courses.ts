import { Router } from "express";
import {
	getCourseByLimit,
	getSingleCourse,
	searchCourse,
} from "../controllers/courseController";

const courseRoute = Router();

courseRoute.get("/search", searchCourse);

courseRoute.get("/:id", getSingleCourse);

courseRoute.get("/", getCourseByLimit);

export default courseRoute;

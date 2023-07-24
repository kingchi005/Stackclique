import { Router } from "express";
import {
	getCourseByLimit,
	getSingleCourse,
} from "../controllers/courseController";

const courseRoute = Router();

courseRoute.get("/:id", getSingleCourse);

courseRoute.get("/", getCourseByLimit);

export default courseRoute;

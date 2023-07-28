import { Router } from "express";
import {
	getCourseByLimit,
	getCourseDetails,
	searchCourse,
} from "../controllers/courseController";

const courseRoute = Router();

courseRoute.get("/", getCourseByLimit);

courseRoute.get("/search", searchCourse);

courseRoute.get("/:id", getCourseDetails);

export default courseRoute;

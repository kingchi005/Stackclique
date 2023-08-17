import { Router } from "express";
import {
	getCourseByLimit,
	getCourseDetails,
	searchCourse,
} from "../controllers/courseController";
import { tryCatchWapper } from "../controllers/errorController";

const courseRoute = Router();

courseRoute.get("/", tryCatchWapper(getCourseByLimit));

courseRoute.get("/search", tryCatchWapper(searchCourse));

courseRoute.get("/:id", tryCatchWapper(getCourseDetails));

export default courseRoute;

import { Router } from "express";
import {
	getUserDetails,
	getErroledCourses,
} from "../controllers/userController";
import { tryCatchWapper } from "../controllers/errorController";

const userRoute = Router();

userRoute.get("/enrolled/:id", tryCatchWapper(getErroledCourses));

userRoute.get("/:id", tryCatchWapper(getUserDetails));

export default userRoute;

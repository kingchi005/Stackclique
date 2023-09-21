import { Router } from "express";
import { tryCatchWapper } from "~/controllers/errorController";
import {
	getErroledCourses,
	getUserDetails,
} from "~/controllers/userController";

const userRoute = Router();

userRoute.get("/enrolled/:id", tryCatchWapper(getErroledCourses));

userRoute.get("/:id", tryCatchWapper(getUserDetails));

export default userRoute;

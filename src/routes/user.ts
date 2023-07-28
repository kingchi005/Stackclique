import { Router } from "express";
import {
	getUserDetails,
	getErroledCourses,
} from "../controllers/userController";

const userRoute = Router();

userRoute.get("/enrolled/:id", getErroledCourses);

userRoute.get("/:id", getUserDetails);

export default userRoute;

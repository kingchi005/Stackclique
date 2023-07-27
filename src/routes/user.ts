import { Router } from "express";
import { fetchUserDetails } from "../controllers/userController";

const userRoute = Router();

userRoute.get("/:id", fetchUserDetails);

export default userRoute;

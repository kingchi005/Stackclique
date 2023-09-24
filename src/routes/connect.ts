import { Router } from "express";
import { tryCatchWapper } from "../controllers/errorController";
import {
	addUserToChannel,
	createChannel,
	getAllChannels,
	getUserChannels,
	sendChatMessage,
} from "../controllers/connectController";
import { onlyAdmins } from "../controllers/middleWare";

const connectRoute = Router();

connectRoute.get("/channels", tryCatchWapper(getAllChannels));

connectRoute.get("/channels/:userId", tryCatchWapper(getUserChannels));

connectRoute.post("/channel", /* onlyAdmins, */ tryCatchWapper(createChannel));

connectRoute.post(
	"/channel/:id/:userId",
	/* onlyAdmins, */
	tryCatchWapper(addUserToChannel)
);

connectRoute.post("/ChatMessage", tryCatchWapper(sendChatMessage));

export default connectRoute;

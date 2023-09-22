import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../controllers/errorController";
import prisma from "../../prisma/index";
import { Server } from "socket.io";
import http from "http";
import {
	addUserToChannel,
	createChannel,
	getAllChannels,
	getUserChannels,
	sendChatMessage,
} from "../controllers/connectController";
import { z } from "zod";
import { onlyAdmins } from "../controllers/middleWare";

const connectRoute = Router();

connectRoute.get("/channels", tryCatchWapper(getAllChannels));
connectRoute.get("/channels/:userId", tryCatchWapper(getUserChannels));
connectRoute.post("/channel", onlyAdmins, tryCatchWapper(createChannel));
connectRoute.post(
	"/channel/:userId",
	onlyAdmins,
	tryCatchWapper(addUserToChannel)
);
connectRoute.post("/ChatMessage", tryCatchWapper(sendChatMessage));
// connectRoute.delete("/channel/:userId", tryCatchWapper(removeUserFromChannel));

// export default connectRoute;

export const initializeSocket = (
	server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
	const io = new Server(server);

	io.on("connection", (socket) => {
		console.log("A user connected");

		socket.on("joinChannel", (req) => {
			// const {userName,room_name}
		});

		socket.on("chat:message", async (data) => {
			const { sender, content } = data;
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected");
		});
	});

	return io;
};

export default connectRoute;

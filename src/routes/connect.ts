import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../controllers/errorController";
import prisma from "../../prisma/index";
import { Server } from "socket.io";
import http from "http";
import {
	createRoom,
	getAllChannels,
	getUserChannels,
} from "../controllers/connectController";
import { z } from "zod";

const connectRoute = Router();

// connectRoute.post("/chat", tryCatchWapper());

connectRoute.get("/channels", tryCatchWapper(getAllChannels));
connectRoute.post(
	"/create-channel",
	/* onlyAdmins */ tryCatchWapper(createRoom)
);
connectRoute.get("/channel:userId", tryCatchWapper(getUserChannels));
connectRoute.post("/chat", tryCatchWapper(getUserChannels));
connectRoute.post("/channel-add-user:userId", tryCatchWapper(getUserChannels));

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

import { Router } from "express";
import { tryCatchWapper } from "~/controllers/errorController";
import prisma from "~/prisma/index";
import { Server } from "socket.io";
import http from "http";

// const connectRoute = Router();

// connectRoute.post("/chat", tryCatchWapper(handleLogin));

// export default connectRoute;

const initializeSocket = (
	server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
	const io = new Server(server);

	io.on("connection", (socket) => {
		console.log("A user connected");

		socket.on("chat:message", async (data) => {
			const { sender, content } = data;

			try {
				const message = await prisma.message.create({
					data: {
						sender,
						content,
					},
				});

				io.emit("chat:message", message);
			} catch (error) {
				console.error("Error saving chat message:", error);
			}
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected");
		});
	});

	return io;
};

export default initializeSocket;

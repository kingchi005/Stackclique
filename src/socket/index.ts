import { Request } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "../constants";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import AppError from "src/controllers/AppError";
import { UNAUTHORIZED } from "src/controllers/errorController";
import { TEvent } from "src/types";

const mountJoinChatEvent = (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
		console.log(`User joined the chat 🤝. chatId: `, chatId);
		// joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
		// E.g. When user types we don't want to emit that event to specific participant.
		// We want to just emit that to the chat where the typing is happening
		socket.join(chatId);
	});
};

const mountParticipantTypingEvent = (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
		socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
	});
};

const mountParticipantStoppedTypingEvent = (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
		socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
	});
};

const initializeSocketIO = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	return io.on(
		"connection",
		async (
			socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
		) => {
			try {
				// parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
				const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

				let token = cookies?.accessToken; // get the accessToken

				if (!token) {
					// If there is no access token in cookies. Check inside the handshake auth
					token = socket.handshake.auth?.token;
				}

				if (!token) {
					// Token is required for the socket to work
					throw new AppError(
						"Un-authorized handshake. Token is missing",
						UNAUTHORIZED.code
					);
				}

				// const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

				// const user = await User.findById(decodedToken?._id).select(
				// 	"-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
				// );

				// // retrieve the user
				// if (!user) {
				// 	throw new AppError(
				// 		"Un-authorized handshake. Token is invalid",
				// 		UNAUTHORIZED.code
				// 	);
				// }
				// socket.user = user; // mount te user object to the socket

				// We are creating a room with user id so that if user is joined but does not have any active chat going on.
				// still we want to emit some socket events to the user.
				// so that the client can catch the event and show the notifications.
				let user: any = {};
				socket.join(user._id.toString());
				socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
				console.log("User connected 🗼. userId: ", user._id.toString());

				// Common events that needs to be mounted on the initialization
				mountJoinChatEvent(socket);
				mountParticipantTypingEvent(socket);
				mountParticipantStoppedTypingEvent(socket);

				socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
					// console.log("user has disconnected 🚫. userId: " + socket.user?._id);
					// if (socket.user?._id) {
					// 	socket.leave(socket.user._id);
					// }
				});
			} catch (error) {
				socket.emit(
					ChatEventEnum.SOCKET_ERROR_EVENT
					// error?.message ||
					// 	"Something went wrong while connecting to the socket."
				);
			}
		}
	);
};

const emitSocketEvent = (
	req: Request,
	roomId: string,
	event: TEvent,
	payload: any
) => {
	req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };

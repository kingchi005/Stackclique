"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocketEvent = exports.initializeSocketIO = void 0;
const cookie_1 = __importDefault(require("cookie"));
const constants_1 = require("../constants");
const AppError_1 = __importDefault(require("../controllers/AppError"));
const errorController_1 = require("../controllers/errorController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../env"));
const prisma_1 = __importDefault(require("../../prisma"));
const middleWare_1 = require("../controllers/middleWare");
const mountJoinChatEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        socket.join(chatId);
    });
};
const mountParticipantTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.TYPING_EVENT, chatId);
    });
};
const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
};
const mountParticipantRemovedOrLeavesEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.LEAVE_CHAT_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.LEAVE_CHAT_EVENT, chatId);
    });
};
const initializeSocketIO = (io) => {
    return io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const cookies = cookie_1.default.parse(((_a = socket.handshake.headers) === null || _a === void 0 ? void 0 : _a.cookie) || "");
            let token = cookies === null || cookies === void 0 ? void 0 : cookies.accessToken;
            if (!token) {
                token = (_b = socket.handshake.auth) === null || _b === void 0 ? void 0 : _b.token;
            }
            if (!token) {
                throw new AppError_1.default("Un-authorized handshake. Token is missing", errorController_1.resCode.UNAUTHORIZED);
            }
            const veriedToken = jsonwebtoken_1.default.verify(token, env_1.default.HASH_SECRET);
            if (!(0, middleWare_1.isValidToken)(veriedToken))
                throw new AppError_1.default("Un-authorized handshake. Token is missing", errorController_1.resCode.UNAUTHORIZED);
            const { id, exp } = veriedToken;
            if (exp && (0, middleWare_1.hasExpired)(exp))
                throw new AppError_1.default("Handshake token has expired", errorController_1.resCode.UNAUTHORIZED);
            const user = yield prisma_1.default.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    profile_photo: true,
                    cover_photo: true,
                    level: true,
                    role: true,
                    created_at: true,
                },
            });
            if (!user)
                throw new AppError_1.default("Un-authorized handshake. Token is invalid", errorController_1.resCode.UNAUTHORIZED);
            socket.data.user = user;
            socket.join(user.id.toString());
            socket.emit(constants_1.ChatEventEnum.CONNECTED_EVENT);
            console.log("User connected 🗼. userId: ", user.id.toString());
            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);
            socket.on(constants_1.ChatEventEnum.DISCONNECT_EVENT, () => {
                var _a, _b;
                console.log("user has disconnected 🚫. userId: " + ((_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id));
                if ((_b = socket.data.user) === null || _b === void 0 ? void 0 : _b.id)
                    socket.leave(socket.data.user.id);
            });
        }
        catch (error) {
            socket.emit(constants_1.ChatEventEnum.SOCKET_ERROR_EVENT);
        }
    }));
};
exports.initializeSocketIO = initializeSocketIO;
const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
};
exports.emitSocketEvent = emitSocketEvent;
//# sourceMappingURL=index.js.map
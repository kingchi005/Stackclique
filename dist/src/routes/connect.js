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
const index_1 = __importDefault(require("~/prisma/index"));
const socket_io_1 = require("socket.io");
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("chat:message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { sender, content } = data;
            try {
                const message = yield index_1.default.message.create({
                    data: {
                        sender,
                        content,
                    },
                });
                io.emit("chat:message", message);
            }
            catch (error) {
                console.error("Error saving chat message:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    return io;
};
exports.default = initializeSocket;
//# sourceMappingURL=connect.js.map
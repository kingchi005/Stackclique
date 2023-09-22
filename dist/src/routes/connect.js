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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const express_1 = require("express");
const errorController_1 = require("../controllers/errorController");
const socket_io_1 = require("socket.io");
const connectController_1 = require("../controllers/connectController");
const middleWare_1 = require("../controllers/middleWare");
const connectRoute = (0, express_1.Router)();
connectRoute.get("/channels", (0, errorController_1.tryCatchWapper)(connectController_1.getAllChannels));
connectRoute.get("/channels/:userId", (0, errorController_1.tryCatchWapper)(connectController_1.getUserChannels));
connectRoute.post("/channel", middleWare_1.onlyAdmins, (0, errorController_1.tryCatchWapper)(connectController_1.createChannel));
connectRoute.post("/channel/:userId", middleWare_1.onlyAdmins, (0, errorController_1.tryCatchWapper)(connectController_1.addUserToChannel));
connectRoute.post("/ChatMessage", (0, errorController_1.tryCatchWapper)(connectController_1.sendChatMessage));
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("joinChannel", (req) => {
        });
        socket.on("chat:message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { sender, content } = data;
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
exports.default = connectRoute;
//# sourceMappingURL=connect.js.map
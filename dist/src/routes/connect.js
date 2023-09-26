"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorController_1 = require("../controllers/errorController");
const connectController_1 = require("../controllers/connectController");
const connectRoute = (0, express_1.Router)();
connectRoute.get("/channels", (0, errorController_1.tryCatchWapper)(connectController_1.getAllChannels));
connectRoute.get("/channels/:userId", (0, errorController_1.tryCatchWapper)(connectController_1.getUserChannels));
connectRoute.post("/channel", (0, errorController_1.tryCatchWapper)(connectController_1.createChannel));
connectRoute.post("/channel/:id/:userId", (0, errorController_1.tryCatchWapper)(connectController_1.addUserToChannel));
connectRoute.post("/chat-message", (0, errorController_1.tryCatchWapper)(connectController_1.sendChatMessage));
exports.default = connectRoute;
//# sourceMappingURL=connect.js.map
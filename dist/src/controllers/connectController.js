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
exports.sendChatMessage = exports.addUserToChannel = exports.createChannel = exports.getUserChannels = exports.getAllChannels = void 0;
const index_1 = __importDefault(require("../../prisma/index"));
const errorController_1 = require("./errorController");
const AppError_1 = __importDefault(require("./AppError"));
const zod_1 = require("zod");
const inputSchema_1 = require("../validation/inputSchema");
const socket_1 = require("../socket");
const getAllChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hcChanels = [
        {
            id: "8d62e50b-7098-5735-87a6-8135d2e10dea",
            name: "sheet",
            profile_photo: "Greece",
            required_user_level: 10,
            created_at: "8/29/2116",
            _count: 2,
        },
        {
            id: "7751eb55-efab-5f55-97de-13d4c06a71e9",
            name: "soil",
            profile_photo: "Mauritius",
            required_user_level: 14,
            created_at: "6/23/2097",
            _count: 6,
        },
        {
            id: "8fa2c093-d576-5234-9766-2a01b6018886",
            name: "red",
            profile_photo: "Barbados",
            required_user_level: 97,
            created_at: "6/14/2078",
            _count: 4,
        },
    ];
    const channels = [
        yield index_1.default.channel.findMany({
            select: {
                id: true,
                name: true,
                profile_photo: true,
                required_user_level: true,
                created_at: true,
                _count: { select: { members: true } },
            },
        }),
    ];
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: [...channels, ...hcChanels],
    });
});
exports.getAllChannels = getAllChannels;
const getUserChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const safeParam = zod_1.z.object({ userId: zod_1.z.string() }).safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { userId: id } = safeParam.data;
    const userChannels = (_a = (yield index_1.default.user.findFirst({
        where: { id },
        select: { channels: true },
    }))) === null || _a === void 0 ? void 0 : _a.channels;
    if (!userChannels)
        throw new AppError_1.default("user not found", errorController_1.errCodeEnum.NOT_FOUND);
    const channels = [
        {
            id: "8d62e50b-7098-5735-87a6-8135d2e10dea",
            name: "sheet",
            profile_photo: "Greece",
            required_user_level: 10,
            created_at: "8/29/2116",
            _count: 2,
        },
        {
            id: "7751eb55-efab-5f55-97de-13d4c06a71e9",
            name: "soil",
            profile_photo: "Mauritius",
            required_user_level: 14,
            created_at: "6/23/2097",
            _count: 6,
        },
    ];
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: [...userChannels, ...channels],
    });
});
exports.getUserChannels = getUserChannels;
const createChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.createChannelSchema.safeParse(req.body);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { name, required_user_level, description } = safeParam.data;
    const newChannel = yield index_1.default.channel.create({
        data: {
            name,
            required_user_level,
            description,
            admin_id: res.locals.user_id,
        },
    });
    if (!newChannel)
        throw new AppError_1.default("An error occoured and channel was not created", errorController_1.errCodeEnum.NO_CONTENT);
    (0, socket_1.emitSocketEvent)(req, newChannel.id, "newChannel", newChannel);
    return res.status(errorController_1.errCodeEnum.CREATED).json({
        ok: true,
        data: newChannel,
        message: "Channel created",
    });
});
exports.createChannel = createChannel;
const addUserToChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.addUserToChannelSchema.safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { userId, id: channelId } = safeParam.data;
    const addedUser = yield index_1.default.user.update({
        where: { id: userId },
        data: { channels: { connect: { id: channelId } } },
        select: {
            id: true,
            username: true,
            profile_photo: true,
            channels: { where: { id: channelId }, select: { id: true, name: true } },
        },
    });
    (0, socket_1.emitSocketEvent)(req, addedUser.channels[0].id, "userAddToChannelEvent", addedUser);
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: addedUser,
        message: "User added",
    });
});
exports.addUserToChannel = addUserToChannel;
const sendChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.sendChatMessageSchema.safeParse(req.body);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { channel_id, message, sender_id } = safeParam.data;
    const newChat = yield index_1.default.chatMessage.create({
        data: {
            message,
            channel_id,
            sender_id,
        },
        include: {},
    });
    if (!newChat)
        throw new AppError_1.default("An error occoured and chat was not created", errorController_1.errCodeEnum.NO_CONTENT);
    (0, socket_1.emitSocketEvent)(req, newChat.channel_id, "newChat", newChat);
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: newChat,
    });
});
exports.sendChatMessage = sendChatMessage;
//# sourceMappingURL=connectController.js.map
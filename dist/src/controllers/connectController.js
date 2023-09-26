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
    return res.status(errorController_1.resCode.OK).json({
        ok: true,
        data: channels,
    });
});
exports.getAllChannels = getAllChannels;
const getUserChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const safeParam = zod_1.z.object({ userId: zod_1.z.string() }).safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.resCode.BAD_REQUEST, safeParam.error);
    const { userId: id } = safeParam.data;
    const userChannels = (_a = (yield index_1.default.user.findFirst({
        where: { id },
        select: { channels: true },
    }))) === null || _a === void 0 ? void 0 : _a.channels;
    if (!userChannels)
        throw new AppError_1.default("user not found", errorController_1.resCode.NOT_FOUND);
    return res.status(errorController_1.resCode.OK).json({
        ok: true,
        data: userChannels,
    });
});
exports.getUserChannels = getUserChannels;
const createChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.createChannelSchema.safeParse(req.body);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.resCode.BAD_REQUEST, safeParam.error);
    const { name, required_user_level, description, admin_id } = safeParam.data;
    const existingChannel = yield index_1.default.channel.findFirst({ where: { name } });
    if (existingChannel)
        throw new AppError_1.default(`Channel with the name '${name}' already exists`, errorController_1.resCode.CONFLICT);
    const newChannel = yield index_1.default.channel.create({
        data: {
            name,
            required_user_level,
            description,
            admin_id: res.locals.user_id || admin_id,
        },
    });
    if (!newChannel)
        throw new AppError_1.default("An error occoured and channel was not created", errorController_1.resCode.NO_CONTENT);
    (0, socket_1.emitSocketEvent)(req, newChannel.id, "newChannel", newChannel);
    return res.status(errorController_1.resCode.CREATED).json({
        ok: true,
        data: newChannel,
        message: "Channel created",
    });
});
exports.createChannel = createChannel;
const addUserToChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.addUserToChannelSchema.safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.resCode.BAD_REQUEST, safeParam.error);
    const { userId, id } = safeParam.data;
    const channel = yield index_1.default.channel.findFirst({ where: { id } });
    if (!channel)
        throw new AppError_1.default(`Channel does not found`, errorController_1.resCode.NOT_FOUND);
    const user = yield index_1.default.user.findFirst({ where: { id: userId } });
    if (!user)
        throw new AppError_1.default(`Not a user`, errorController_1.resCode.NOT_FOUND);
    if (user.level < channel.required_user_level)
        throw new AppError_1.default(`User not eligible`, errorController_1.resCode.NOT_ACCEPTED);
    const addedUser = yield index_1.default.user.update({
        where: { id: userId },
        data: { channels: { connect: { id: channel.id } } },
        select: {
            id: true,
            username: true,
            profile_photo: true,
            channels: { where: { id: channel.id }, select: { id: true, name: true } },
        },
    });
    (0, socket_1.emitSocketEvent)(req, addedUser.channels[0].id, "userAddToChannelEvent", addedUser);
    return res.status(errorController_1.resCode.OK).json({
        ok: true,
        data: addedUser,
        message: "User added",
    });
});
exports.addUserToChannel = addUserToChannel;
const sendChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.sendChatMessageSchema.safeParse(req.body);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.resCode.BAD_REQUEST, safeParam.error);
    const { channel_id, message, sender_id } = safeParam.data;
    const channel = yield index_1.default.channel.findFirst({
        where: { id: channel_id },
        include: { members: true },
    });
    if (!channel)
        throw new AppError_1.default(`Channel does not found`, errorController_1.resCode.NOT_FOUND);
    const userMember = channel.members.find((member) => member.id == sender_id);
    if (!userMember)
        throw new AppError_1.default(`User not a member of ${channel.name} channel`, errorController_1.resCode.NOT_FOUND);
    const newChat = yield index_1.default.chatMessage.create({
        data: {
            message,
            channel_id,
            sender_id,
        },
        include: {},
    });
    if (!newChat)
        throw new AppError_1.default("An error occoured and chat was not created", errorController_1.resCode.NO_CONTENT);
    (0, socket_1.emitSocketEvent)(req, newChat.channel_id, "newChat", newChat);
    return res.status(errorController_1.resCode.OK).json({
        ok: true,
        data: newChat,
    });
});
exports.sendChatMessage = sendChatMessage;
//# sourceMappingURL=connectController.js.map
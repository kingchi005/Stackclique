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
const getAllChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const channels = [
        ...(yield index_1.default.channel.findMany({
            select: {
                id: true,
                name: true,
                profile_photo: true,
                required_user_level: true,
                created_at: true,
                _count: { select: { members: true } },
            },
        })),
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
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: channels,
    });
});
exports.getAllChannels = getAllChannels;
const getUserChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z.object({ userId: zod_1.z.string() }).safeParse(req.query);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.BAD_REQUEST.code, safeParam.error);
    const { userId } = safeParam.data;
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
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: channels,
    });
});
exports.getUserChannels = getUserChannels;
const createChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: "ready to create",
    });
});
exports.createChannel = createChannel;
const addUserToChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: "ready to addUserToChannel",
    });
});
exports.addUserToChannel = addUserToChannel;
const sendChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(errorController_1.OK.code).json({
        ok: true,
        data: "ready to sendChatMessage and create ChatMessage",
    });
});
exports.sendChatMessage = sendChatMessage;
//# sourceMappingURL=connectController.js.map
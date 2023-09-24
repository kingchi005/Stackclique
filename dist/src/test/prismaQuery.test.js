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
const prisma_1 = __importDefault(require("../../prisma"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const userId = "ac9bf395-aefe-45d4-a32f-1ab995725320";
    const channelId = "4b8e9bea-2c55-4416-a8fb-4ee570f6b06f";
    const addedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { channels: { connect: { id: channelId } } },
        select: {
            id: true,
            username: true,
            profile_photo: true,
            channels: { where: { id: channelId }, select: { id: true, name: true } },
        },
    });
    console.log(JSON.stringify(addedUser, null, 2));
});
//# sourceMappingURL=prismaQuery.test.js.map
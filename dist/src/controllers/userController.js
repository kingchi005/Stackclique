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
exports.fetchUserDetails = void 0;
const inputSchema_1 = require("../zodSchema/inputSchema");
const prisma_1 = __importDefault(require("../../prisma"));
const fetchUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.idParamSchema.safeParse(req.params);
    if (!safeParam.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safeParam.error.issues.map((d) => d.message).join(", "),
                details: safeParam.error,
            },
        });
    const { id } = safeParam.data;
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            phone_number: true,
            level: true,
            notifications: true,
            profile_photo: true,
            cover_photo: true,
            enrolled_courses: { select: { course: {}, enrolled_date: true } },
        },
    });
    const course_progrees = 0;
    if (!user)
        return res.status(404).json({
            ok: false,
            error: { message: "User not found" },
        });
    return res.status(200).json({
        ok: true,
        data: user,
    });
});
exports.fetchUserDetails = fetchUserDetails;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const id = "0d860861-b9d6-4270-8791-56d91ad977bf";
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            phone_number: true,
            level: true,
            notifications: true,
            profile_photo: true,
            cover_photo: true,
            enrolled_courses: {
                select: {
                    course: { include: { module: {} } },
                    enrolled_date: true,
                    completed_modules: true,
                    completed: true,
                },
            },
        },
    });
    const course_progrees = 0;
    console.log(user);
}))();
//# sourceMappingURL=userController.js.map
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
exports.getErroledCourses = exports.getUserDetails = void 0;
const inputSchema_1 = require("../validation/inputSchema");
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = __importDefault(require("./AppError"));
const errorController_1 = require("./errorController");
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.idParamSchema.safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { id } = safeParam.data;
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            level: true,
            notifications: true,
            profile_photo: true,
            cover_photo: true,
            enrolled_courses: {
                select: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            about: true,
                            profile_photo: true,
                            _count: { select: { enrollement: {}, reviews: {} } },
                        },
                    },
                    completed_modules: true,
                    completed: true,
                    enrolled_at: true,
                    completed_at: true,
                },
            },
        },
    });
    if (!user)
        throw new AppError_1.default("User not found", errorController_1.errCodeEnum.NOT_FOUND);
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: user,
    });
});
exports.getUserDetails = getUserDetails;
const getErroledCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.idParamSchema.safeParse(req.params);
    if (!safeParam.success)
        throw new AppError_1.default(safeParam.error.issues.map((d) => d.message).join(", "), errorController_1.errCodeEnum.BAD_REQUEST, safeParam.error);
    const { id } = safeParam.data;
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            enrolled_courses: {
                select: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            category: { select: { name: true } },
                            about: true,
                            profile_photo: true,
                            cover_photo: true,
                            required_user_level: true,
                            _count: { select: { module: true } },
                        },
                    },
                    completed: true,
                    completed_modules: true,
                    enrolled_at: true,
                },
            },
        },
    });
    if (!user)
        throw new AppError_1.default(`User with id '${id}' does not exist`, errorController_1.errCodeEnum.NOT_FOUND);
    if (user.enrolled_courses.length < 1)
        throw new AppError_1.default(`User with id '${id}' is not enrolled in any course`, errorController_1.errCodeEnum.NOT_FOUND);
    return res.status(errorController_1.errCodeEnum.OK).json({
        ok: true,
        data: user.enrolled_courses,
    });
});
exports.getErroledCourses = getErroledCourses;
//# sourceMappingURL=userController.js.map
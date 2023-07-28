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
exports.searchCourse = exports.getCourseByLimit = exports.getCourseDetails = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../prisma"));
const getCourseDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z.object({ id: zod_1.z.string() }).safeParse(req.params);
    if (!safeParam.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safeParam.error.issues.map((d) => d.message).join(", "),
                details: safeParam.error,
            },
        });
    const { id } = safeParam.data;
    const course = yield prisma_1.default.course.findFirst({
        where: { id },
        include: {
            category: { select: { name: true } },
            module: {
                select: {
                    id: true,
                    name: true,
                    title: true,
                    profile_photo: true,
                    cover_photo: true,
                },
            },
            reviews: true,
            _count: { select: { enrollement: {}, reviews: {}, module: true } },
        },
    });
    if (!course)
        return res.status(404).json({
            ok: false,
            error: { message: "Course not found" },
        });
    return res.status(200).json({
        ok: true,
        data: course,
    });
});
exports.getCourseDetails = getCourseDetails;
const getCourseByLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z.object({ p: zod_1.z.string() }).safeParse(req.query);
    if (!safeParam.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safeParam.error.issues.map((d) => d.message).join(", "),
                details: safeParam.error,
            },
        });
    const { p } = safeParam.data;
    const courses = yield prisma_1.default.course.findMany({
        take: +p,
        // },
        select: {
            id: true,
            title: true,
            about: true,
            category: { select: { name: true } },
            profile_photo: true,
            cover_photo: true,
            required_user_level: true,
            reviews: true,
            _count: { select: { enrollement: {}, reviews: {}, module: true } },
        },
    });
    if ((courses === null || courses === void 0 ? void 0 : courses.length) < 1)
        return res.status(404).json({
            ok: false,
            error: { message: "No course in record" },
        });
    return res.status(200).json({
        ok: true,
        data: courses,
    });
});
exports.getCourseByLimit = getCourseByLimit;
const searchCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({
        category: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
    })
        .safeParse(req.query);
    if (!safeParam.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safeParam.error.issues.map((d) => d.message).join(", "),
                details: safeParam.error,
            },
        });
    const { category, title } = safeParam.data;
    const courses = yield prisma_1.default.course.findMany({
        where: {
            category: { name: { contains: category } },
            title: { contains: title },
        },
        // include: {
        // 	// category: { select: { name: true, description: true } },
        // },
        select: {
            id: true,
            title: true,
            reviews: true,
            _count: { select: { enrollement: {}, reviews: {} } },
            profile_photo: true,
        },
    });
    if (courses.length < 1)
        return res.status(404).json({
            ok: false,
            error: { message: "No result found" },
        });
    return res.status(200).json({
        ok: true,
        data: courses,
    });
});
exports.searchCourse = searchCourse;
(() => __awaiter(void 0, void 0, void 0, function* () { }))();
//# sourceMappingURL=courseController.js.map
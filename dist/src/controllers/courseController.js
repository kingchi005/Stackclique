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
exports.getErroledCourses = exports.searchCourse = exports.getCourseByLimit = exports.getSingleCourse = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../prisma"));
const getSingleCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            module: true,
            reviews: true,
            // enrolled_users: true,
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
exports.getSingleCourse = getSingleCourse;
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
        // include: {
        // 	category: { select: { name: true } },
        // 	module: true,
        // 	reviews: true,
        // 	enrollement: { select: { enrolled_user: true } },
        // },
        select: {
            id: true,
            title: true,
            reviews: true,
            _count: { select: { enrollement: {}, reviews: {} } },
            profile_photo: true,
            cover_photo: true,
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
const getErroledCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z.object({ user_id: zod_1.z.string() }).safeParse(req.params);
    if (!safeParam.success)
        return res.status(401).json({
            ok: false,
            error: {
                message: safeParam.error.issues.map((d) => d.message).join(", "),
                details: safeParam.error,
            },
        });
    const id = safeParam.data.user_id;
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
        return res.status(401).json({
            ok: false,
            error: { message: `User with id '${id}' does not exist` },
        });
    if (user.enrolled_courses.length < 1)
        return res.status(404).json({
            ok: false,
            error: { message: `User with id '${id}' is not enrolled in any course` },
        });
    return res.status(200).json({
        ok: true,
        data: user.enrolled_courses,
    });
});
exports.getErroledCourses = getErroledCourses;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const id = "1d321ad0-2225-423d-b406-9a0cdc937af3";
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
    console.log(user === null || user === void 0 ? void 0 : user.enrolled_courses);
}))();
//# sourceMappingURL=courseController.js.map
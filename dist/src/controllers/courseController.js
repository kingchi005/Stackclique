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
exports.getCourseByLimit = exports.getSingleCourse = void 0;
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
        where: { id: +id },
    });
    res.status(200).json({
        ok: true,
        data: course,
    });
});
exports.getSingleCourse = getSingleCourse;
const getCourseByLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: `get ${req.query.p} courses` });
});
exports.getCourseByLimit = getCourseByLimit;
//# sourceMappingURL=courseController.js.map
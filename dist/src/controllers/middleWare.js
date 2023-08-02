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
exports.secureRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputSchema_1 = require("../zodSchema/inputSchema");
const prisma_1 = __importDefault(require("../../prisma"));
const env_1 = __importDefault(require("../../env"));
const secureRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isValid = inputSchema_1.bearerTokenSchema.safeParse(req.headers.authorization);
    if (!isValid.success)
        return res.status(401).json({
            ok: false,
            error: { message: "Invalid API key" },
        });
    const providedToken = (_b = (_a = isValid.data.split(" ")) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!providedToken)
        return res.status(401).json({
            ok: false,
            error: { message: "Invalid API key" },
        });
    let id = "";
    try {
        id = jsonwebtoken_1.default.verify(providedToken, env_1.default.HASH_SECRET);
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            error: { message: "Invalid API key", details: error },
        });
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            profile_photo: true,
            cover_photo: true,
            level: true,
            notifications: true,
            enrolled_courses: {
                select: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            reviews: true,
                            _count: { select: { enrollement: {}, reviews: {} } },
                            profile_photo: true,
                        },
                    },
                    enrolled_at: true,
                },
            },
            created_at: true,
        },
    });
    if (!user)
        return res.status(401).json({
            ok: false,
            error: { message: "Not a user" },
        });
    res.locals.user_id = user.id;
    next();
});
exports.secureRoute = secureRoute;
(() => {
})();
//# sourceMappingURL=middleWare.js.map
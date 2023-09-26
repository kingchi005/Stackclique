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
exports.authenticate = exports.onlyAdmins = exports.hasExpired = exports.isValidToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputSchema_1 = require("../validation/inputSchema");
const prisma_1 = __importDefault(require("../../prisma"));
const env_1 = __importDefault(require("../../env"));
const AppError_1 = __importDefault(require("./AppError"));
const errorController_1 = require("./errorController");
const isValidToken = (obj) => obj !== null && typeof obj == "object" && "id" in obj;
exports.isValidToken = isValidToken;
const hasExpired = (exp) => exp * 1000 < new Date().getTime();
exports.hasExpired = hasExpired;
const onlyAdmins = (req, res, next) => {
    try {
        const userRole = res.locals.user_role;
        if (userRole !== "Admin")
            throw new AppError_1.default("You are not an Admin", errorController_1.resCode.UNAUTHORIZED);
        else
            next();
    }
    catch (err) {
        next(err);
    }
};
exports.onlyAdmins = onlyAdmins;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const isValid = inputSchema_1.bearerTokenSchema.safeParse(req.headers.authorization);
        if (!isValid.success)
            throw new AppError_1.default("Please provide an API key", errorController_1.resCode.UNAUTHORIZED);
        const providedToken = (_b = (_a = isValid.data.split(" ")) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim();
        if (!providedToken)
            throw new AppError_1.default("Invalid API key", errorController_1.resCode.UNAUTHORIZED);
        const veriedToken = jsonwebtoken_1.default.verify(providedToken, env_1.default.HASH_SECRET);
        if (!(0, exports.isValidToken)(veriedToken))
            throw new AppError_1.default("Invalid API key", errorController_1.resCode.UNAUTHORIZED);
        const { id, exp } = veriedToken;
        if (exp && (0, exports.hasExpired)(exp))
            throw new AppError_1.default("API key has expired", errorController_1.resCode.UNAUTHORIZED);
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
                role: true,
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
            throw new AppError_1.default("Invalid API key", errorController_1.resCode.UNAUTHORIZED);
        res.locals.user_id = user.id;
        res.locals.user_role = user.role;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.authenticate = authenticate;
(() => {
})();
//# sourceMappingURL=middleWare.js.map
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
exports.tryCatchWapper = exports.errMsgEnum = exports.errCodeEnum = void 0;
const AppError_1 = __importDefault(require("./AppError"));
const jsonwebtoken_1 = require("jsonwebtoken");
exports.errCodeEnum = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTED: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
exports.errMsgEnum = {
    OK: "OK",
    CREATED: "Created",
    ACCEPTED: "Accepted",
    NO_CONTENT: "No Content",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    NOT_ACCEPTED: "Not Accepted",
    CONFLICT: "Conflict",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    BAD_GATEWAY: "Bad Gateway",
    SERVICE_UNAVAILABLE: "Service Unavailable",
    GATEWAY_TIMEOUT: "Gateway Timeout",
};
function errorController(error, req, res, next) {
    console.log(error);
    if (error instanceof AppError_1.default)
        return res.status(error.statusCode).json({
            ok: false,
            error: { message: error.message, details: error.details },
        });
    if (error instanceof jsonwebtoken_1.JsonWebTokenError)
        return res.status(exports.errCodeEnum.UNAUTHORIZED).json({
            ok: false,
            error: {
                message: "Invalid API key",
                details: error,
            },
        });
    return res.status(exports.errCodeEnum.INTERNAL_SERVER_ERROR).json({
        ok: false,
        error: {
            message: "Something went wrong",
            details: error,
        },
    });
}
exports.default = errorController;
const tryCatchWapper = (controller) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield controller(req, res);
    }
    catch (error) {
        return next(error);
    }
});
exports.tryCatchWapper = tryCatchWapper;
//# sourceMappingURL=errorController.js.map
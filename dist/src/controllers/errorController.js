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
exports.tryCatchWapper = exports.GATEWAY_TIMEOUT = exports.SERVICE_UNAVAILABLE = exports.BAD_GATEWAY = exports.INTERNAL_SERVER_ERROR = exports.CONFLICT = exports.NOT_ACCEPTED = exports.METHOD_NOT_ALLOWED = exports.NOT_FOUND = exports.FORBIDDEN = exports.UNAUTHORIZED = exports.BAD_REQUEST = exports.NO_CONTENT = exports.ACCEPTED = exports.CREATED = exports.OK = void 0;
const AppError_1 = __importDefault(require("./AppError"));
exports.OK = { code: 200, message: "OK" };
exports.CREATED = { code: 201, message: "Created" };
exports.ACCEPTED = { code: 202, message: "Accepted" };
exports.NO_CONTENT = { code: 204, message: "No Content" };
exports.BAD_REQUEST = { code: 400, message: "Bad Request" };
exports.UNAUTHORIZED = { code: 401, message: "Unauthorized" };
exports.FORBIDDEN = { code: 403, message: "Forbidden" };
exports.NOT_FOUND = { code: 404, message: "Not Found" };
exports.METHOD_NOT_ALLOWED = { code: 405, message: "Method Not Allowed" };
exports.NOT_ACCEPTED = { code: 406, message: "Not Accepted" };
exports.CONFLICT = { code: 409, message: "Conflict" };
exports.INTERNAL_SERVER_ERROR = {
    code: 500,
    message: "Internal Server Error",
};
exports.BAD_GATEWAY = { code: 502, message: "Bad Gateway" };
exports.SERVICE_UNAVAILABLE = {
    code: 503,
    message: "Service Unavailable",
};
exports.GATEWAY_TIMEOUT = { code: 504, message: "Gateway Timeout" };
function errorController(error, req, res, next) {
    if (error instanceof AppError_1.default) {
        console.log(error);
        return res.status(error.statusCode).json({
            ok: false,
            error: { message: error.message, details: error.details },
        });
    }
    return res.status(exports.INTERNAL_SERVER_ERROR.code).json({
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
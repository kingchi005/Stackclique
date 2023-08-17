"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map
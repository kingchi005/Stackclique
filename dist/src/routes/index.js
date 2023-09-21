"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRoute = exports.courseRoute = exports.userRoute = exports.authRoute = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var user_1 = require("./user");
Object.defineProperty(exports, "userRoute", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var courses_1 = require("./courses");
Object.defineProperty(exports, "courseRoute", { enumerable: true, get: function () { return __importDefault(courses_1).default; } });
var connect_1 = require("./connect");
Object.defineProperty(exports, "connectRoute", { enumerable: true, get: function () { return __importDefault(connect_1).default; } });
//# sourceMappingURL=index.js.map
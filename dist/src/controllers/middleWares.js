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
const zod_1 = require("zod");
const inputSchema_1 = require("../zodSchema/inputSchema");
const secureRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const valid = zod_1.z
        .object({ authorization: inputSchema_1.bearerTokenSchema })
        .safeParse(req.headers);
    if (!valid.success)
        return res.status(401).json({
            ok: false,
            error: { message: "Unauthorised" },
        });
    const { authorization } = valid.data;
    const token = jsonwebtoken_1.default.decode(authorization);
    console.log(token);
    next();
});
exports.secureRoute = secureRoute;
//# sourceMappingURL=middleWares.js.map
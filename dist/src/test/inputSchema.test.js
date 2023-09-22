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
Object.defineProperty(exports, "__esModule", { value: true });
const inputSchema_1 = require("../validation/inputSchema");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = inputSchema_1.sendChatMessageSchema.safeParse({
        message: "skjgdhshng",
        channel_id: "sdsds",
        sender_id: "sdsds",
    });
    if (!safeParam.success)
        console.log({
            msg: safeParam.error.issues.map((d) => d.message).join(", "),
            details: JSON.stringify(safeParam.error.errors, null, 2),
        });
    else
        console.log(safeParam);
});
//# sourceMappingURL=inputSchema.test.js.map
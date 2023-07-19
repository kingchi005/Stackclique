"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.userInputSchema = void 0;
const zod_1 = require("zod");
exports.userInputSchema = zod_1.z.number({
    invalid_type_error: "'id' must be a number",
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "name is required",
        invalid_type_error: "'name' must be a string",
    })
        .min(3, { message: "'name' must be 3 ore more characters" }),
    email: zod_1.z.string().email({ message: "provide a valid email" }),
});
//# sourceMappingURL=inputSchema.js.map
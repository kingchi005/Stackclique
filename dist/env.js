"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string(),
    BASE_URL: zod_1.z.string(),
    DATABASE_URL: zod_1.z.string(),
    DEV_ENV: zod_1.z.string(),
    HASH_SECRET: zod_1.z.string(),
    MAIL_USER: zod_1.z.string(),
    MAIL_PASSWORD: zod_1.z.string(),
    MAIL_HOST: zod_1.z.string(),
    MAIL_PORT: zod_1.z.string(),
});
const env = envSchema.parse(process.env);
exports.default = env;
//# sourceMappingURL=env.js.map
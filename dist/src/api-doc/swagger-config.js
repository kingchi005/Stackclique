"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerConfig_json_1 = __importDefault(require("./swaggerConfig.json"));
const env_1 = __importDefault(require("../../env"));
swaggerConfig_json_1.default.servers[0].url = env_1.default.BASE_URL;
exports.default = swaggerConfig_json_1.default;
//# sourceMappingURL=swagger-config.js.map
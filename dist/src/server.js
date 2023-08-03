"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./api-doc/swagger-config"));
const courses_1 = __importDefault(require("./routes/courses"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: ["https://app.swaggerhub.com/"] }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/dev/api-docs", swagger_ui_express_1.default.serve);
app.get("/dev/api-docs", swagger_ui_express_1.default.setup(swagger_config_1.default));
app.use("/auth", auth_1.default);
app.use("/courses", courses_1.default);
app.use("/user", user_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});
exports.default = app;
//# sourceMappingURL=server.js.map
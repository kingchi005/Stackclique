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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
// swagger api doc
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./api-doc/swagger-config"));
const env_1 = __importDefault(require("../env"));
const courses_1 = __importDefault(require("./routes/courses"));
const app = (0, express_1.default)();
const PORT = +env_1.default.PORT || 3000;
// Middleware setup
app.use((0, cors_1.default)({ origin: ["https://app.swaggerhub.com/"] }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Doc endpoint
app.use("/dev/api-docs", swagger_ui_express_1.default.serve);
app.get("/dev/api-docs", swagger_ui_express_1.default.setup(swagger_config_1.default));
// Routes setup
app.use("/auth", auth_1.default);
app.use("/courses", courses_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port ${PORT}`);
    // await prisma.$connect();
}));
//# sourceMappingURL=server.js.map
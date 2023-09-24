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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const env_1 = __importDefault(require("../env"));
const routes_1 = require("./routes");
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = +env_1.default.PORT || 3000;
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});
app.set("io", io);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.get("/", (req, res) => {
    res.status(300).json({ msg: "welcome to the stackclique api" });
});
app.use("/auth", routes_1.authRoute);
app.use("/courses", routes_1.courseRoute);
app.use("/user", routes_1.userRoute);
app.use("/connect", routes_1.connectRoute);
app.use(errorController_1.default);
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server at ${env_1.default.BASE_URL}`);
}));
//# sourceMappingURL=server.js.map
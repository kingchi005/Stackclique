import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import env from "../env";

import errorController from "./controllers/errorController";
import { authenticate } from "./controllers/middleWare";
// swagger api doc
// import swaggerUI from "swagger-ui-express";
import swaggerConfig from "./api-doc/swagger-config";
import { authRoute, connectRoute, courseRoute, userRoute } from "./routes";
import { initializeSocket } from "./routes/connect";
import path from "path";
// import { rateLimit } from "express-rate-limit";

const app: Application = express();
const server = http.createServer(app);
// initializeSocket(server);
const PORT = +env.PORT || 3000;

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// 	handler: (_, __, ___, options) => {
// 		throw new ApiError(
// 			options.statusCode || 500,
// 			`There are too many requests. You are only allowed ${
// 				options.max
// 			} requests per ${options.windowMs / 60000} minutes`
// 		);
// 	},
// });

// Apply the rate limiting middleware to all requests
// app.use(limiter);

// Middleware setup
const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	},
});

app.set("io", io);

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// API Doc endpoint
app.get("/", (req, res) => {
	res.status(300).json({ msg: "welcome to the stackclique api" });
});
// app.use("/dev/api-docs", swaggerUI.serve);
// app.get("/dev/api-docs", swaggerUI.setup(swaggerConfig));

// Routes setup
app.use("/auth", authRoute);

// authenticate routes
// app.use(authenticate);

app.use("/courses", courseRoute);
app.use("/user", userRoute);
app.use("/connect", connectRoute);

server.listen(PORT, async () => {
	console.log(`Server at ${env.BASE_URL}`);
	// await prisma.$connect();
});

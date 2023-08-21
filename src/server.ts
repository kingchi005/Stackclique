import express, { Application } from "express";
import cors from "cors";
import env from "../env";

import errorController from "./controllers/errorController";
import { authenticate } from "./controllers/middleWare";
// swagger api doc
import swaggerUI from "swagger-ui-express";
import swaggerConfig from "./api-doc/swagger-config";
import { authRoute, courseRoute, userRoute } from "./routes";

const app: Application = express();
const PORT = +env.PORT || 3000;

// Middleware setup
app.use(cors({ origin: ["https://app.swaggerhub.com/"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Doc endpoint
app.get("/", (re, res) => {
	res.status(300).json({ msg: "welcome to the stackclique api" });
});
app.use("/dev/api-docs", swaggerUI.serve);
app.get("/dev/api-docs", swaggerUI.setup(swaggerConfig));

// Routes setup
app.use("/auth", authRoute);

// authenticate routes
app.use(authenticate);

app.use("/courses", courseRoute);
app.use("/user", userRoute);

app.use(errorController);

app.listen(PORT, async () => {
	console.log(`Server at ${env.BASE_URL}`);
	// await prisma.$connect();
});

import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import authRouter from "./routes/auth";
// import prisma from "./prisma";

// swagger api doc
import swaggerUI from "swagger-ui-express";

import swaggerConfig from "./swagger.config";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({ origin: ["https://app.swaggerhub.com/"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Doc endpoint
app.use("/dev/api-docs", swaggerUI.serve);
app.get("/dev/api-docs", swaggerUI.setup(swaggerConfig));
// Routes setup

app.use("/auth", authRouter);
app.use("/user", userRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
	console.error(err.stack);
	res.status(500).send("Internal Server Error");
});

app.listen(PORT, async () => {
	console.log(`Server running on port ${PORT}`);
	// await prisma.$connect();
});

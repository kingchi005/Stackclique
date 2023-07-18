import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user";
// import prisma from "./prisma";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setup

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

console.log("ready");

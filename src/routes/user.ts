import { Router, Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";
import { createUserSchema, userInputSchema } from "../zodSchema/inputSchema";

const router = Router();

// GET /user
router.get("/", async (req: Request, res: Response) => {
	// const { id } = req.params;
	try {
		const users = await prisma.user.findMany({
			where: {},
			select: { id: true, name: true, email: true },
		});
		res
			.status(200)
			.json(<SuccessResponse<typeof users>>{ ok: true, data: users });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

// GET /user/:id
router.get("/:id", async (req: Request, res: Response) => {
	const data = userInputSchema.safeParse(+req.params.id);
	// return console.log(JSON.stringify(data, null, 2));
	if (!data.success)
		return res.status(201).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: data.error.issues[0].message, details: data.error },
		});
	try {
		const user = await prisma.user.findUnique({
			where: { id: data.data },
			select: { id: true, name: true, email: true },
		});
		if (!user) {
			res.status(404).json(<ErrorResponse<typeof user>>{
				ok: false,
				error: { message: "User not found" },
			});
		} else {
			res
				.status(200)
				.json(<SuccessResponse<typeof user>>{ ok: true, data: user });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "An error occoured" },
		});
	}
});

// POST /user
router.post("/", async (req: Request, res: Response) => {
	const safe = createUserSchema.safeParse(req.body);
	if (!safe.success)
		return res.status(201).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: safe.error.issues[0].message, details: safe.error },
		});

	const { name, email } = safe.data;
	try {
		const user = await prisma.user.create({
			data: {
				name,
				email,
			},
		});
		res.status(201).json(<SuccessResponse<typeof safe.data>>{
			ok: true,
			message: "user created successfully",
			data: user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json(<ErrorResponse<typeof error>>{
			ok: true,
			error: { message: "An error occoured", details: error },
		});
	}
});

// PUT /user/:id
router.put("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, email } = req.body;
	try {
		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				name,
				email,
			},
		});
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

// DELETE /user/:id
router.delete("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await prisma.user.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

export default router;

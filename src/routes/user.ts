import { Router, Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";

const router = Router();

// GET /user
// router.get("/", async (req: Request, res: Response) => {
// 	// const { id } = req.params;
// 	try {
// 		const users = {
// 			name: "Theodore King",
// 			email: "rem@se.ua",
// 			phoneId: "08107721911",
// 			address: "U6FFAGTEgp2xu5Ik0P",
// 		};
// 		res.status(200).json({ ok: true, data: users } as SuccessResponse<any>);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).send("Internal Server Error");
// 	}
// });

// GET /user/:id
router.get("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const user = await prisma.user.findUnique({ where: { id: Number(id) } });
		if (!user) {
			res.status(404).json({
				ok: false,
				error: { message: "User not found" },
			} as ErrorResponse<any>);
		} else {
			res
				.status(200)
				.json({ ok: true, message: "ready to go" } as SuccessResponse<any>);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

// POST /user
router.post("/", async (req: Request, res: Response) => {
	const { name, email } = req.body;
	try {
		const user = await prisma.user.create({
			data: {
				name,
				email,
			},
		});
		res.status(201).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
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

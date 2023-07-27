import { Request, Response } from "express";
import { idParamSchema } from "../zodSchema/inputSchema";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";

export const fetchUserDetails = async (req: Request, res: Response) => {
	const safeParam = idParamSchema.safeParse(req.params);

	if (!safeParam.success)
		return res.status(401).json(<ErrorResponse<typeof safeParam.error>>{
			ok: false,
			error: {
				message: safeParam.error.issues.map((d) => d.message).join(", "),
				details: safeParam.error,
			},
		});

	const { id } = safeParam.data;

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			username: true,
			phone_number: true,
			level: true,
			notifications: true,
			profile_photo: true,
			cover_photo: true,
			enrolled_courses: { select: { course: {}, enrolled_date: true } },
		},
	});

	const course_progrees: number = 0;

	if (!user)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "User not found" },
		});

	return res.status(200).json(<SuccessResponse<typeof user>>{
		ok: true,
		data: user,
	});
};

(async () => {
	const id = "0d860861-b9d6-4270-8791-56d91ad977bf";
	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			username: true,
			phone_number: true,
			level: true,
			notifications: true,
			profile_photo: true,
			cover_photo: true,
			enrolled_courses: {
				select: {
					course: { include: { module: {} } },
					enrolled_date: true,
					completed_modules: true,
					completed: true,
				},
			},
		},
	});

	const course_progrees: number = 0;
	console.log(user);
})();

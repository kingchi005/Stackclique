import { Request, Response } from "express";
import { z } from "zod";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";

export const getSingleCourse = async (req: Request, res: Response) => {
	const safeParam = z.object({ id: z.string() }).safeParse(req.params);

	if (!safeParam.success)
		return res.status(401).json(<ErrorResponse<typeof safeParam.error>>{
			ok: false,
			error: {
				message: safeParam.error.issues.map((d) => d.message).join(", "),
				details: safeParam.error,
			},
		});

	const { id } = safeParam.data;
	const course = await prisma.course.findFirst({
		where: { id },
		include: {
			category: { select: { name: true } },
			module: true,
			reviews: true,
			// enrolled_users: true,
		},
	});

	if (!course)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "Course not found" },
		});

	return res.status(200).json(<SuccessResponse<typeof course>>{
		ok: true,
		data: course,
	});
};

export const getCourseByLimit = async (req: Request, res: Response) => {
	const safeParam = z.object({ p: z.string() }).safeParse(req.query);

	if (!safeParam.success)
		return res.status(401).json(<ErrorResponse<typeof safeParam.error>>{
			ok: false,
			error: {
				message: safeParam.error.issues.map((d) => d.message).join(", "),
				details: safeParam.error,
			},
		});

	const { p } = safeParam.data;

	const courses = await prisma.course.findMany({
		take: +p,
		include: {
			category: { select: { name: true } },
			module: true,
			reviews: true,
			enrolled_users: { select: { username: true } },
		},
	});

	if (courses?.length < 1)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "No course in record" },
		});

	return res.status(200).json(<SuccessResponse<typeof courses>>{
		ok: true,
		data: courses,
	});
};

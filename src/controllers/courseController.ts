import { Request, Response } from "express";
import { number, string, z } from "zod";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";
import { idParamSchema } from "../zodSchema/inputSchema";

export const getCourseDetails = async (req: Request, res: Response) => {
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
			module: {
				select: {
					id: true,
					name: true,
					title: true,
					profile_photo: true,
					cover_photo: true,
				},
			},
			reviews: true,
			_count: { select: { enrollement: {}, reviews: {}, module: true } },
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

		// },
		select: {
			id: true,
			title: true,
			about: true,
			category: { select: { name: true } },
			profile_photo: true,
			cover_photo: true,
			required_user_level: true,
			reviews: true,
			_count: { select: { enrollement: {}, reviews: {}, module: true } },
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

export const searchCourse = async (req: Request, res: Response) => {
	const safeParam = z
		.object({
			category: z.string().optional(),
			title: z.string().optional(),
		})
		.safeParse(req.query);

	if (!safeParam.success)
		return res.status(401).json(<ErrorResponse<typeof safeParam.error>>{
			ok: false,
			error: {
				message: safeParam.error.issues.map((d) => d.message).join(", "),
				details: safeParam.error,
			},
		});

	const { category, title } = safeParam.data;

	const courses = await prisma.course.findMany({
		where: {
			category: { name: { contains: category } },
			title: { contains: title },
		},
		// include: {
		// 	// category: { select: { name: true, description: true } },
		// },
		select: {
			id: true,
			title: true,
			reviews: true,
			_count: { select: { enrollement: {}, reviews: {} } },
			profile_photo: true,
		},
	});

	if (courses.length < 1)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: "No result found" },
		});

	return res.status(200).json(<SuccessResponse<typeof courses>>{
		ok: true,
		data: courses,
	});
};

(async () => {})();

import { Request, Response } from "express";
import { z } from "zod";
import AppError from "./AppError";
import prisma from "../../prisma/index";
import { SuccessResponse } from "../types";
import { resCode } from "./errorController";

export const getCourseDetails = async (req: Request, res: Response) => {
	const safeParam = z.object({ id: z.string() }).safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

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
					content: true,
					profile_photo: true,
					cover_photo: true,
				},
			},
			reviews: true,
			_count: { select: { enrollement: {}, reviews: {}, module: true } },
		},
	});

	if (!course) throw new AppError("Course not found", resCode.NOT_FOUND);

	return res.status(resCode.OK).json(<SuccessResponse<typeof course>>{
		ok: true,
		data: course,
	});
};

export const getCourseByLimit = async (req: Request, res: Response) => {
	const safeParam = z.object({ p: z.string() }).safeParse(req.query);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { p } = safeParam.data;

	const courses = await prisma.course.findMany({
		take: 15,

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
		throw new AppError("No course in record", resCode.NOT_FOUND);

	return res.status(resCode.OK).json(<SuccessResponse<typeof courses>>{
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
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { category, title } = safeParam.data;

	const courses = await prisma.course.findMany({
		where: {
			category: { name: { contains: category } },
			title: { contains: title },
		},

		select: {
			id: true,
			title: true,
			reviews: true,
			_count: { select: { enrollement: {}, reviews: {} } },
			profile_photo: true,
		},
	});

	if (courses.length < 1)
		throw new AppError("No result found", resCode.NOT_FOUND);

	return res.status(resCode.OK).json(<SuccessResponse<typeof courses>>{
		ok: true,
		data: courses,
	});
};

(async () => {})();

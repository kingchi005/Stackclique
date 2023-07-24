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
		where: { id: +id },
	});

	res.status(200).json(<SuccessResponse<typeof course>>{
		ok: true,
		data: course,
	});
};

export const getCourseByLimit = async (req: Request, res: Response) => {
	res.json({ msg: `get ${req.query.p} courses` });
};

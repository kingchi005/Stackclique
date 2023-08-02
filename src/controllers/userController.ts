import { Request, Response } from "express";
import { idParamSchema } from "../zodSchema/inputSchema";
import { ErrorResponse, SuccessResponse } from "../types";
import prisma from "../../prisma";

export const getUserDetails = async (req: Request, res: Response) => {
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
			level: true,
			notifications: true,
			profile_photo: true,
			cover_photo: true,
			enrolled_courses: {
				select: {
					course: {
						select: {
							id: true,
							title: true,
							about: true,
							profile_photo: true,
							_count: { select: { enrollement: {}, reviews: {} } },
						},
					},
					completed_modules: true,
					completed: true,
					enrolled_at: true,
					completed_at: true,
				},
			},
		},
	});

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

export const getErroledCourses = async (req: Request, res: Response) => {
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
			enrolled_courses: {
				select: {
					course: {
						select: {
							id: true,
							title: true,
							category: { select: { name: true } },
							about: true,
							profile_photo: true,
							cover_photo: true,
							required_user_level: true,
							_count: { select: { module: true } },
						},
					},

					completed: true,
					completed_modules: true,
					enrolled_at: true,
				},
			},
		},
	});

	if (!user)
		return res.status(401).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: `User with id '${id}' does not exist` },
		});

	if (user.enrolled_courses.length < 1)
		return res.status(404).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: `User with id '${id}' is not enrolled in any course` },
		});

	return res.status(200).json(<SuccessResponse<typeof user.enrolled_courses>>{
		ok: true,
		data: user.enrolled_courses,
	});
};

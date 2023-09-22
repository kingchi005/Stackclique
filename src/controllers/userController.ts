import { Request, Response } from "express";
import { idParamSchema } from "../validation/inputSchema";
import { SuccessResponse } from "../types";
import prisma from "../../prisma";
import AppError from "./AppError";
import { errCodeEnum, errMsgEnum } from "./errorController";

export const getUserDetails = async (req: Request, res: Response) => {
	const safeParam = idParamSchema.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

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

	if (!user) throw new AppError("User not found", errCodeEnum.NOT_FOUND);

	return res.status(errCodeEnum.OK).json(<SuccessResponse<typeof user>>{
		ok: true,
		data: user,
	});
};

export const getErroledCourses = async (req: Request, res: Response) => {
	const safeParam = idParamSchema.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

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
		throw new AppError(
			`User with id '${id}' does not exist`,
			errCodeEnum.NOT_FOUND
		);

	if (user.enrolled_courses.length < 1)
		throw new AppError(
			`User with id '${id}' is not enrolled in any course`,
			errCodeEnum.NOT_FOUND
		);

	return res.status(errCodeEnum.OK).json(<
		SuccessResponse<typeof user.enrolled_courses>
	>{
		ok: true,
		data: user.enrolled_courses,
	});
};

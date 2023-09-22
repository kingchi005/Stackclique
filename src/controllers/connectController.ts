import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import prisma from "../../prisma/index";
import { errCodeEnum } from "./errorController";
import AppError from "./AppError";
import { z } from "zod";
import {
	addUserToChannelSchema,
	createChannelSchema,
	createUserSchema,
	sendChatMessageSchema,
} from "../validation/inputSchema";
/*
 * /channels - getAllChannels
 * /channels/:userId - getUserChannels
 * /channel - createChannel
 * /channel/:userId - addUserToChannel
 * /ChatMessage - sendChatMessage
 *
 */

export const getAllChannels = async (req: Request, res: Response) => {
	const hcChanels = [
		{
			id: "8d62e50b-7098-5735-87a6-8135d2e10dea",
			name: "sheet",
			profile_photo: "Greece",
			required_user_level: 10,
			created_at: "8/29/2116",
			_count: 2,
		},
		{
			id: "7751eb55-efab-5f55-97de-13d4c06a71e9",
			name: "soil",
			profile_photo: "Mauritius",
			required_user_level: 14,
			created_at: "6/23/2097",
			_count: 6,
		},
		{
			id: "8fa2c093-d576-5234-9766-2a01b6018886",
			name: "red",
			profile_photo: "Barbados",
			required_user_level: 97,
			created_at: "6/14/2078",
			_count: 4,
		},
	];

	const channels = [
		await prisma.channel.findMany({
			select: {
				id: true,
				name: true,
				profile_photo: true,
				required_user_level: true,
				created_at: true,
				_count: { select: { members: true } },
			},
		}),
	];

	return res.status(errCodeEnum.OK).json(<SuccessResponse<typeof channels>>{
		ok: true,
		data: [...channels, ...hcChanels],
	});
};

export const getUserChannels = async (req: Request, res: Response) => {
	// userId
	const safeParam = z.object({ userId: z.string() }).safeParse(req.query);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

	const { userId: id } = safeParam.data;

	const userChannels = (
		await prisma.user.findFirst({
			where: { id },
			select: { channel: true },
		})
	)?.channel;

	if (!userChannels) throw new AppError("user not found", 404);

	const channels = [
		// ...(await prisma.channel.findMany({where:{users:{every:{}}}})),
		{
			id: "8d62e50b-7098-5735-87a6-8135d2e10dea",
			name: "sheet",
			profile_photo: "Greece",
			required_user_level: 10,
			created_at: "8/29/2116",
			_count: 2,
		},
		{
			id: "7751eb55-efab-5f55-97de-13d4c06a71e9",
			name: "soil",
			profile_photo: "Mauritius",
			required_user_level: 14,
			created_at: "6/23/2097",
			_count: 6,
		},
	];

	return res.status(errCodeEnum.OK).json(<SuccessResponse<typeof channels>>{
		ok: true,
		data: [...userChannels, ...channels],
	});
};

export const createChannel = async (req: Request, res: Response) => {
	const safeParam = createChannelSchema.safeParse(req.body);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

	const { name, required_user_level } = safeParam.data;

	return res.status(errCodeEnum.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: "ready to create",
	});
};

export const addUserToChannel = async (req: Request, res: Response) => {
	const safeParam = addUserToChannelSchema.safeParse(req.body);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

	const { user_id } = safeParam.data;

	return res.status(errCodeEnum.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: "ready to addUserToChannel",
	});
};

export const sendChatMessage = async (req: Request, res: Response) => {
	const safeParam = sendChatMessageSchema.safeParse(req.body);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

	const { channel_id, message, sender_id } = safeParam.data;

	return res.status(errCodeEnum.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: "ready to sendChatMessage and create ChatMessage",
	});
};

/* export const onChatMessage = async (data: any) => {
	const { sender, content } = data;

	try {
		// const message = await prisma.chat
		// io.emit("chat:message", message);
	} catch (error) {
		console.error("Error saving chat message:", error);
	}
}; */

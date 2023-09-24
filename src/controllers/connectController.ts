import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import prisma from "../../prisma/index";
import { errCodeEnum } from "./errorController";
import AppError from "./AppError";
import { z } from "zod";
import {
	addUserToChannelSchema,
	createChannelSchema,
	sendChatMessageSchema,
} from "../validation/inputSchema";
import { emitSocketEvent } from "../socket";
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
	const safeParam = z.object({ userId: z.string() }).safeParse(req.params);

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
			select: { channels: true },
		})
	)?.channels;

	if (!userChannels)
		throw new AppError("user not found", errCodeEnum.NOT_FOUND);

	const channels = [
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

	const { name, required_user_level, description } = safeParam.data;

	// verify that channel is not already -----------------------------

	const newChannel = await prisma.channel.create({
		data: {
			name,
			required_user_level,
			description,
			admin_id: res.locals.user_id,
		},
	});

	if (!newChannel)
		throw new AppError(
			"An error occoured and channel was not created",
			errCodeEnum.NO_CONTENT
		);

	emitSocketEvent(req, newChannel.id, "newChannel", newChannel);

	return res.status(errCodeEnum.CREATED).json(<SuccessResponse<any>>{
		ok: true,
		data: newChannel,
		message: "Channel created",
	});
};

export const addUserToChannel = async (req: Request, res: Response) => {
	const safeParam = addUserToChannelSchema.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			errCodeEnum.BAD_REQUEST,
			safeParam.error
		);

	const { userId, id: channelId } = safeParam.data;

	// verify that channel is existing -----------------------
	// verify that user is existing -----------------------

	const addedUser = await prisma.user.update({
		where: { id: userId },
		data: { channels: { connect: { id: channelId } } },
		select: {
			id: true,
			username: true,
			profile_photo: true,
			channels: { where: { id: channelId }, select: { id: true, name: true } },
		},
	});

	emitSocketEvent(
		req,
		addedUser.channels[0].id,
		"userAddToChannelEvent",
		addedUser
	);

	return res.status(errCodeEnum.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: addedUser,
		message: "User added",
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

	// verify that channel is existing and sender is a member of the channel -----------------------

	const newChat = await prisma.chatMessage.create({
		data: {
			message,
			channel_id,
			sender_id,
		},
		include: {},
	});

	if (!newChat)
		throw new AppError(
			"An error occoured and chat was not created",
			errCodeEnum.NO_CONTENT
		);

	emitSocketEvent(req, newChat.channel_id, "newChat", newChat);

	return res.status(errCodeEnum.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: newChat,
	});
};

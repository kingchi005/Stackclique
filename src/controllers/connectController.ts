import { Request, Response } from "express";
import { SuccessResponse } from "../types";
import prisma from "../../prisma/index";
import { resCode } from "./errorController";
import AppError from "./AppError";
import { z } from "zod";
import {
	addUserToChannelSchema,
	createChannelSchema,
	sendChatMessageSchema,
} from "../validation/inputSchema";
import { emitSocketEvent } from "../socket";
/*
 * /channels - getAllChannels - get
 * /channels/:userId - getUserChannels - get
 * /channel - createChannel - post
 * /channel/:userId - addUserToChannel - post
 * /ChatMessage - sendChatMessage - post
 *
 */

export const getAllChannels = async (req: Request, res: Response) => {
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

	return res.status(resCode.OK).json(<SuccessResponse<typeof channels>>{
		ok: true,
		data: channels,
	});
};

export const getUserChannels = async (req: Request, res: Response) => {
	// userId
	const safeParam = z.object({ userId: z.string() }).safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { userId: id } = safeParam.data;

	const userChannels = (
		await prisma.user.findFirst({
			where: { id },
			select: { channels: true },
		})
	)?.channels;

	if (!userChannels) throw new AppError("user not found", resCode.NOT_FOUND);

	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: userChannels,
	});
};

export const createChannel = async (req: Request, res: Response) => {
	const safeParam = createChannelSchema.safeParse(req.body);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { name, required_user_level, description, admin_id } = safeParam.data;

	// verify that channel is not already -----------------------------
	const existingChannel = await prisma.channel.findFirst({ where: { name } });
	if (existingChannel)
		throw new AppError(
			`Channel with the name '${name}' already exists`,
			resCode.CONFLICT
		);

	const newChannel = await prisma.channel.create({
		data: {
			name,
			required_user_level,
			description,
			admin_id: res.locals.user_id || admin_id,
		},
	});

	if (!newChannel)
		throw new AppError(
			"An error occoured and channel was not created",
			resCode.NO_CONTENT
		);

	emitSocketEvent(req, newChannel.id, "newChannel", newChannel);

	return res.status(resCode.CREATED).json(<SuccessResponse<any>>{
		ok: true,
		data: newChannel,
		message: "Channel created",
	});
};

export const getChannelDetails = async (req: Request, res: Response) => {
	const safeParam = z.object({ id: z.string() }).safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { id } = safeParam.data;

	const channel = await prisma.channel.findFirst({
		where: { id },
		select: {
			id: true,
			name: true,
			profile_photo: true,
			required_user_level: true,
			created_at: true,
			members: true,
			chatsMessages: {
				include: {
					sender: { select: { profile_photo: true, username: true } },
				},
			},
			_count: { select: { members: true } },
		},
	});

	return res.status(resCode.OK).json(<SuccessResponse<typeof channel>>{
		ok: true,
		data: channel,
	});
};

export const addUserToChannel = async (req: Request, res: Response) => {
	const safeParam = addUserToChannelSchema.safeParse(req.params);

	if (!safeParam.success)
		throw new AppError(
			safeParam.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { userId, id } = safeParam.data;

	const channel = await prisma.channel.findFirst({ where: { id } });
	if (!channel) throw new AppError(`Channel does not found`, resCode.NOT_FOUND);

	const user = await prisma.user.findFirst({ where: { id: userId } });

	if (!user) throw new AppError(`Not a user`, resCode.NOT_FOUND);

	if (user.level < channel.required_user_level)
		throw new AppError(`User not eligible`, resCode.NOT_ACCEPTED);

	const addedUser = await prisma.user.update({
		where: { id: userId },
		data: { channels: { connect: { id: channel.id } } },
		select: {
			id: true,
			username: true,
			profile_photo: true,
			channels: { where: { id: channel.id }, select: { id: true, name: true } },
		},
	});

	emitSocketEvent(
		req,
		addedUser.channels[0].id,
		"userAddToChannelEvent",
		addedUser
	);

	return res.status(resCode.OK).json(<SuccessResponse<any>>{
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
			resCode.BAD_REQUEST,
			safeParam.error
		);

	const { channel_id, message, sender_id } = safeParam.data;

	// verify that channel is existing and sender is a member of the channel -----------------------
	const channel = await prisma.channel.findFirst({
		where: { id: channel_id },
		include: { members: true },
	});
	if (!channel) throw new AppError(`Channel does not found`, resCode.NOT_FOUND);

	const userMember = channel.members.find((member) => member.id == sender_id);

	if (!userMember)
		throw new AppError(
			`User not a member of ${channel.name} channel`,
			resCode.NOT_FOUND
		);

	const newChat = await prisma.chatMessage.create({
		data: {
			message,
			channel_id,
			sender_id,
		},
		include: {
			sender: { select: { profile_photo: true, username: true } },
		},
	});

	if (!newChat)
		throw new AppError(
			"An error occoured and chat was not created",
			resCode.NO_CONTENT
		);

	emitSocketEvent(req, newChat.channel_id, "newChat", newChat);

	return res.status(resCode.OK).json(<SuccessResponse<any>>{
		ok: true,
		data: newChat,
	});
};

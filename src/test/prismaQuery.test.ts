import prisma from "../../prisma";

export default async () => {
	const userId = "ac9bf395-aefe-45d4-a32f-1ab995725320";
	const channelId = "4b8e9bea-2c55-4416-a8fb-4ee570f6b06f";

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

	console.log(JSON.stringify(addedUser, null, 2));
};

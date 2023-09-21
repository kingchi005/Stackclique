import prisma from "~/prisma/index";

export const onChatMessage = async (data) => {
	const { sender, content } = data;

	try {
		const message = await prisma.message.create({
			data: {
				sender,
				content,
			},
		});

		io.emit("chat:message", message);
	} catch (error) {
		console.error("Error saving chat message:", error);
	}
};

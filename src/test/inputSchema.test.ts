import { sendChatMessageSchema } from "../validation/inputSchema";

export default async () => {
	const safeParam = sendChatMessageSchema.safeParse({
		message: "skjgdhshng",
		channel_id: "sdsds",
		sender_id: "sdsds",
	});

	if (!safeParam.success)
		console.log({
			msg: safeParam.error.issues.map((d) => d.message).join(", "),
			details: JSON.stringify(safeParam.error.errors, null, 2),
		});
	else console.log(safeParam);
};

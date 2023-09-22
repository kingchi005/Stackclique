import { ChatEventEnum } from "./constants";

type IResponse = {
	ok: boolean;
};

export type userRole = "Admin" | "Instructor" | "User";
export type ErrorResponse<T> = IResponse & {
	error: {
		message: string;
		details?: T;
	};
};

export type SuccessResponse<T> = IResponse & {
	message?: string;
	data?: T;
};

const details = {
	email: "wrong",
	name: "required",
	password: "incorrect",
};

const err: ErrorResponse<typeof details> = {
	ok: false,
	error: {
		message: "test error",
		details,
	},
};

const data = {
	name: "Theodore King",
	email: "rem@se.ua",
	phoneId: "f847f89d-3742-5344-a3cc-44e7312178e5",
	address: "U6FFAGTEgp2xu5Ik0P",
};

const res: SuccessResponse<typeof data> = {
	ok: true,
	data,
};

const AvailableChatEvents = Object.values(ChatEventEnum);
export type TEvent = (typeof AvailableChatEvents)[0];

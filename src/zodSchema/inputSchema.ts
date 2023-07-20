import { z } from "zod";

export const userInputSchema = z.number({
	invalid_type_error: "'id' must be a number",
});

export const createUserSchema = z.object({
	name: z
		.string({
			required_error: "name is required",
			invalid_type_error: "'name' must be a string",
		})
		.min(3, { message: "'name' must be 3 ore more characters" }),
	email: z.string().email({ message: "provide a valid email" }),
});

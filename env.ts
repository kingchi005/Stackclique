import { z } from "zod";

const envSchema = z.object({
	PORT: z.string(),
	BASE_URL: z.string(),
	DATABASE_URL: z.string(),
	DEV_ENV: z.string(),
	HASH_SECRET: z.string(),
	MAIL_USER: z.string(),
	MAIL_PASSWORD: z.string(),
	MAIL_HOST: z.string(),
	MAIL_PORT: z.string(),
	TEXTFLOW_API_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;

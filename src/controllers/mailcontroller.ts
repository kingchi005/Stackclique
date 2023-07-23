import mailer from "nodemailer";
import env from "../../env";

export const transporter = mailer.createTransport({
	host: env.MAIL_HOST,
	port: 0,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASSWORD,
	},
});

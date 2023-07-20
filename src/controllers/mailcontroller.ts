import mailer from "nodemailer";

export const transporter = mailer.createTransport({
	host: process.env.NODEMAILER_HOST,
	port: 0,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

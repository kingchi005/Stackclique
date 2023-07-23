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

export const sendEmail = ({ to, message }: { to: string; message: string }) => {
	const mailOptions = {
		from: env.MAIL_USER, // sender address
		to, // list of receivers
		// subject: "", // Subject line
		html: message, // plain text body
	};
};

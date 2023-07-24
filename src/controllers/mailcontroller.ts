import mailer from "nodemailer";
import env from "../../env";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporter = mailer.createTransport({
	// host: env.MAIL_HOST,
	service: "gmail",
	// port: 587,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASSWORD,
	},
});

export const sendEmail = async (
	to: string,
	message: string,
	subject?: string
) => {
	try {
		const mailOptions = {
			from: "Stack Clique", // sender address
			to, // list of receivers
			subject,
			html: message, // plain text body
		};

		const info = await transporter.sendMail(mailOptions);

		return {
			success: true,
			message: `Email sent to  ${info.envelope.to} `,
			details: info,
		};
	} catch (error) {
		console.log(error);

		return { success: false, details: error };
	}
};

export const sendTestMail = async (
	to: string,
	message: string
): Promise<{
	success: boolean;
	message?: string;
	details: SMTPTransport.SentMessageInfo | unknown;
}> => {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	try {
		let testAccount = await mailer.createTestAccount();

		// create reusable transporter object using the default SMTP transport
		let transporter = mailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass, // generated ethereal password
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: "Stack Clique", // sender address
			to, // list of receivers
			// subject: "Hello ✔", // Subject line
			// text: "Hello world?", // plain text body
			html: message, // html body
		});
		console.log(info);

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", mailer.getTestMessageUrl(info));
		return {
			success: true,
			message: `Email sent ${info.messageId} `,
			details: info,
		};
	} catch (error) {
		console.log(error);

		return { success: false, details: error };
	}
	// return info;
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

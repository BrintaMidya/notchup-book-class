const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "demo.mail.brinta@gmail.com", // your email address to send email from
		pass: "abcde@12345", // your gmail account password
	},
});

module.exports = transporter;

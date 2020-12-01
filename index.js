const transporter = require("./config");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = process.env.PORT || 8080;

// HTTP request logger
app.use(morgan("tiny"));

// data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const getDate = (unixTime) => {
	var dateObj = new Date(unixTime * 1);
	var dateString = dateObj.toLocaleDateString("en-US");

	return dateString;
};

const getTime = (unixTime) => {
	var dateObj = new Date(unixTime * 1);
	var hour = dateObj.getHours().toString();
	var min = dateObj.getMinutes().toString();
	return `${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;
};

app.post("/send", (req, res) => {
	console.log(req.body);
	try {
		const mailOptions = {
			from: "demo.mail.brinta@gmail.com", // sender address
			to: req.body.parentMail, // list of receivers
			subject: "NotchUp Trial Class Booked successfully", // Subject line
			html: `<h2>Dear ${req.body.parentName},</h2>
					<h3>${req.body.childName}'s class at
					${getTime(req.body.slot)} on ${getDate(req.body.slot)}
					has been successfully booked</h3>`,
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.status(500).send({
					success: false,
					message: "Something went wrong. Try again later",
				});
			} else {
				res.send({
					success: true,
					message:
						"Your demo class has been booked. An email has been sent to your registered email address",
				});
			}
		});
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "Something went wrong. Try again later",
		});
		console.log(error);
	}
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});

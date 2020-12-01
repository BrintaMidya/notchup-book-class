import React from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

class Form extends React.Component {
	constructor(props) {
		super(props);

		this.data = [];

		this.state = {
			parentName: "",
			parentNumber: "",
			parentMail: "",
			childName: "",
			childAge: "",
			courseName: "",
			date: "",
			time: "",
			dateList: {},
			timeList: [],
			result: null,
			loading: false,
		};
	}

	componentDidMount = () => {
		this.url =
			"https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec";

		fetch(this.url)
			.then((response) => response.json())
			.then((data) => {
				this.data = data;
				this.setState({
					courseList: data.map((course) => {
						return course.course_name;
					}),
				});
			});
	};

	getTime = (unixTime) => {
		var dateObj = new Date(unixTime * 1);
		var hour = dateObj.getHours().toString().padStart(2, "0");
		var min = dateObj.getMinutes().toString().padStart(2, "0");
		return { timeStamp: unixTime, hour: hour, min: min };
	};

	getDate = (unixTime) => {
		var dateObj = new Date(unixTime * 1);
		var year = dateObj.getFullYear();
		var month = dateObj.getMonth + 1;
		var day = dateObj.getDate();
		var dateString = dateObj.toLocaleDateString("en-US");

		return {
			dateString: dateString,
			day: day,
			month: month,
			year: year,
			timeStamp: unixTime,
		};
	};

	setDateList = (courseName) => {
		var course = this.data.filter((c) => c.course_name === courseName)[0];
		var dates = {};
		var slots = course["slots"].map((s) => s.slot);
		for (var slot of slots) {
			//console.log(slot);
			var date = this.getDate(slot);
			var time = this.getTime(slot);
			//console.log(time);
			var key = date.dateString;
			if (key in dates) {
				dates[key].slots.push(time);
			} else {
				dates[key] = { date: date, slots: [time] };
			}
		}
		this.setState({ dateList: dates });
	};

	getSortedDates = () => {
		var dateList = this.state.dateList;
		var dates = Object.keys(dateList);

		dates.sort(function (first, second) {
			return dateList[first].date.timeStamp - dateList[second].date.timeStamp;
		});
		return dates;
	};

	setTimeList = (date) => {
		var slots = this.state.dateList[date].slots;

		slots.sort(function (first, second) {
			return first.timeStamp - second.timeStamp;
		});

		this.setState({ timeList: slots });
	};

	handleParentName = (event) => {
		event.preventDefault();
		this.setState({ parentName: event.target.value });
	};
	handleParentNumber = (event) => {
		event.preventDefault();
		this.setState({ parentNumber: event.target.value });
	};
	handleParentMail = (event) => {
		event.preventDefault();
		this.setState({ parentMail: event.target.value });
	};
	handleChildName = (event) => {
		event.preventDefault();
		this.setState({ childName: event.target.value });
	};
	handleChildAge = (event) => {
		event.preventDefault();
		this.setState({ childAge: event.target.value });
	};
	handleCourseName = (event) => {
		event.preventDefault();

		var courseName = event.target.value;
		if (courseName) {
			this.setState({ courseName: courseName });
			this.setDateList(courseName);
		}
	};
	handleDate = (event) => {
		event.preventDefault();

		var date = event.target.value;
		this.setState({ date: date });
		this.setTimeList(date);
	};
	handleTime = (event) => {
		event.preventDefault();
		this.setState({ time: event.target.value });
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const parentName = this.state.parentName.trim();
		const parentNumber = this.state.parentNumber.trim();
		const parentMail = this.state.parentMail.trim();
		const childName = this.state.childName.trim();
		const childAge = this.state.childAge;
		const courseName = this.state.courseName;
		const slot = this.state.time;

		axios
			.post("/send", {
				parentName,
				parentNumber,
				parentMail,
				childName,
				childAge,
				courseName,
				slot,
			})
			.then((response) => {
				this.setState({ loading: false, result: response.data });
				alert(this.state.result.message);
				this.setState({
					parentName: "",
					parentNumber: "",
					parentMail: "",
					childName: "",
					childAge: "",
					courseName: "",
					date: "",
					time: "",
					dateList: {},
					timeList: [],
					result: null,
				});
			})
			.catch(() => {
				console.log("error sending data");
				this.setState({
					loading: false,
					result: {
						success: false,
						message: "Something went wrong, try again later !",
					},
				});
				alert(this.state.result.message);
			});
	};

	render() {
		if (this.state.loading) {
			return <LoadingSpinner />;
		} else {
			return (
				<div
					style={{ margin: "50px" }}
					className="ui raised very padded text container segment"
				>
					<form className="ui form" onSubmit={this.handleSubmit}>
						<div className="twelve required field">
							<label>Parent's Name:</label>
							<input
								type="text"
								value={this.state.parentName}
								onChange={this.handleParentName}
							/>
						</div>
						<div className="twelve required field">
							<label>Parent's Number:</label>
							<input
								type="text"
								value={this.state.parentNumber}
								onChange={this.handleParentNumber}
							/>
						</div>
						<div className="twelve required field">
							<label>Parent's Email:</label>
							<input
								type="email"
								value={this.state.parentMail}
								onChange={this.handleParentMail}
							/>
						</div>
						<div className="twelve required field">
							<label>Child's Name:</label>
							<input
								type="text"
								value={this.state.childName}
								onChange={this.handleChildName}
							/>
						</div>
						<div className="inline required field">
							<label>Child's Age:</label>
							<input
								type="number"
								value={this.state.childAge}
								onChange={this.handleChildAge}
							/>
						</div>
						<div className="inline required field">
							<label>Select a Course:</label>
							<select
								value={this.state.courseName}
								onChange={this.handleCourseName}
							>
								<option value="">Select Course</option>
								{this.data.map((course) => {
									return (
										<option key={course.course_id} value={course.course_name}>
											{course.course_name}
										</option>
									);
								})}
							</select>
						</div>
						<div className="inline required field">
							<label>Select a Date:</label>
							<select value={this.state.date} onChange={this.handleDate}>
								<option value="">Select Date</option>
								{this.getSortedDates().map((date) => {
									return (
										<option key={date} value={date}>
											{date}
										</option>
									);
								})}
							</select>
						</div>
						<div className="inline required field">
							<label>Select a Time Slot:</label>
							<select value={this.state.time} onChange={this.handleTime}>
								<option value="">Select Slot</option>
								{this.state.timeList.map((slot) => {
									return (
										<option key={slot.timeStamp} value={slot.timeStamp}>
											{`${slot.hour}:${slot.min}`}
										</option>
									);
								})}
							</select>
						</div>
						<input className="ui primary button" type="submit" value="Submit" />
					</form>
				</div>
			);
		}
	}
}

export default Form;

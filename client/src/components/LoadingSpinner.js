import React from "react";

const LoadingSpinner = (props) => {
	return (
		<div className="ui active dimmer">
			<div className="ui medium text loader">{props.message}</div>
		</div>
	);
};

LoadingSpinner.defaultProps = {
	message: "Loading...",
};

export default LoadingSpinner;

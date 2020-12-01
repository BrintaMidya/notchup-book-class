import React from "react";
import Form from "./Form";

function App() {
	return (
		<div>
			<div>
				<h1 style={{ textAlign: "center" }}>
					<img
						style={{ width: "100px", height: "100px" }}
						src="https://media.glassdoor.com/sqll/3470236/notchup-squarelogo-1593844921605.png"
						alt="Notch Up"
					/>
				</h1>
				<h1 style={{ textAlign: "center" }}>Book Demo Class</h1>
			</div>

			<Form />
		</div>
	);
}

export default App;

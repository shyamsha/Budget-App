import React, { Component } from "react";

class Budget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			budgetAmount: 0
		};
	}

	render() {
		return (
			<div>
				<p>{this.state.budgetAmount}</p>
			</div>
		);
	}
}

export default Budget;

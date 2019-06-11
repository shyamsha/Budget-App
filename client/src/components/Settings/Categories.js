import React, { Component } from "react";
import Budget from "./Budget";
class Categories extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: ""
		};
	}

	render() {
		console.log(this.props);
		return (
			<div>
				<div>
					<Budget />
				</div>
				<p>categories</p>
			</div>
		);
	}
}

export default Categories;

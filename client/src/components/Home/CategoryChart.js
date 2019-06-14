import React, { Component } from "react";
import axios from "../../config/config";
class CategoryChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			expenses: []
		};
	}

	componentDidMount() {
		Promise.all([axios.get("/categories"), axios.get("/expenses")])
			.then(response => {
				this.setState(() => ({
					categories: response[0].data,
					expenses: response[1].data
				}));
			})
			.catch(err => {
				console.log(err);
			});
	}
	render() {
		console.log(this.state);
		return (
			<div style={{ float: "right" }}>
				Category Wise Split
				<table border="2">
					<tbody>
						<tr>
							{this.state.categories.map(cat => {
								return <th key={cat._id}>{cat.category}</th>;
							})}
						</tr>
						<tr>
							{this.state.expenses.map(exp => {
								let tamount = 0;
								return this.state.categories.map(cat => {
									if (exp.category._id === cat._id) {
										tamount += Number(exp.amount);
									}
									console.log(tamount);
									// return <td>{amount}</td>;
								});
							})}
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default CategoryChart;

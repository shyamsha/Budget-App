import React, { Component } from "react";
import axios from "../../config/config";
import "./table.css";

class CategoryChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			expenses: []
		};
	}
	componentDidMount() {
		Promise.all([
			axios.get("/categories", {
				headers: { "x-auth": localStorage.getItem("token") }
			}),
			axios.get("/expenses", {
				headers: { "x-auth": localStorage.getItem("token") }
			})
		])
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

	calculateChart() {
		const data = {};
		this.state.categories.forEach(category => {
			const expenses = this.props.expenses.filter(
				expense => expense.category === category.category
			);
			let total = 0;
			expenses.forEach(expense => (total += Number(expense.amount)));
			data[category.category] = total;
		});
		return data;
	}
	render() {
		let category = this.calculateChart();

		return (
			<div style={{ float: "right" }}>
				Category Wise Split
				<table>
					<thead>
						<tr>
							{this.state.categories.map(cat => {
								return <th key={cat._id}>{cat.category}</th>;
							})}
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.keys(category).map((amount, i) => {
								return <td key={i + 1}>{category[amount]}</td>;
							})}
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default CategoryChart;

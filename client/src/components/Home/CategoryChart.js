import React, { Component } from "react";
import axios from "../../config/config";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
	root: {
		width: "40%",

		// marginTop: theme.spacing.unit * 1,
		overflowX: "auto"
		// float: "right"
	},
	table: {
		width: 120
	}
});

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

	calculateChart() {
		const data = {};
		this.state.categories.forEach(category => {
			const expenses = this.state.expenses.filter(
				expense => expense.category.category === category.category
			);
			let total = 0;
			expenses.forEach(expense => (total += Number(expense.amount)));
			data[category.category] = total;
		});
		return data;
	}
	render() {
		console.log(this.calculateChart());
		let category = this.calculateChart();
		const { classes } = this.props;
		return (
			<div style={{ float: "right" }}>
				Category Wise Split
				<Paper className={classes.root}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Categories</TableCell>
								<TableCell align="right">BudgetSpent</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.categories.map(cat => (
								<TableRow key={cat._id}>
									<TableCell component="th" scope="row">
										{cat.category}
									</TableCell>
									<TableCell align="right">software</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			</div>
		);
	}
}

CategoryChart.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryChart);

//  let id = 0;
//  function createData(name, calories, ) {
// 	id += 1;
// 	return { id, name, calories, };
// }

// const rows = [
// 	createData("yoghurt", 159),
// 	createData("Ice cream", 237),
// 	createData("Eclair", 262),
// 	createData("Cupcake", 305),
// 	createData("Gingerbread", 356)
// ];

// function SimpleTable(props) {
//

// 	return (

// 	);
// }

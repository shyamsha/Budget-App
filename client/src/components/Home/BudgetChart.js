import React, { Component } from "react";
import axios from "../../config/config";
import { Doughnut } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";

Chart.pluginService.register({
	beforeDraw: function(chart) {
		if (chart.config.options.elements.center) {
			//Get ctx from string
			var ctx = chart.chart.ctx;

			//Get options from the center object in options
			var centerConfig = chart.config.options.elements.center;
			var fontStyle = centerConfig.fontStyle || "Arial";
			var txt = centerConfig.text;
			var color = centerConfig.color || "#000";
			var sidePadding = centerConfig.sidePadding || 20;
			var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
			//Start with a base font of 30px
			ctx.font = "30px " + fontStyle;

			//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
			var stringWidth = ctx.measureText(txt).width;
			var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

			// Find out how much the font can grow in width.
			var widthRatio = elementWidth / stringWidth;
			var newFontSize = Math.floor(30 * widthRatio);
			var elementHeight = chart.innerRadius * 2;

			// Pick a new font size so it will not be larger than the height of label.
			var fontSizeToUse = Math.min(newFontSize, elementHeight);

			//Set font settings to draw it correctly.
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
			var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
			ctx.font = fontSizeToUse + "px " + fontStyle;
			ctx.fillStyle = color;

			//Draw text in center
			ctx.fillText(txt, centerX, centerY);
		}
	}
});
class BudgetChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			budgetAmount: 0,
			spentamount: 0,
			data: props.data ? props.data : []
		};
	}

	componentDidMount() {
		axios
			.get("/budget", {
				headers: { "x-auth": localStorage.getItem("token") }
			})
			.then(response => {
				let amount = 0;
				response.data.forEach(budget => {
					amount = budget.budgetAmount;
				});
				this.setState(() => ({
					budgetAmount: amount
				}));
			})
			.catch(err => {
				console.log(err);
			});
	}
	render() {
		let spentamount = 0;
		this.props.data.forEach(expense => {
			spentamount += Number(expense.amount);
		});
		let percent = (spentamount * 100) / this.state.budgetAmount;
		return (
			<div>
				Budget Wise Split
				<div style={{ marginLeft: "15rem", marginTop: "0.5rem" }}>
					<span style={{ color: "blue" }}>
						Total Amount:{this.state.budgetAmount} <br />
					</span>
					<span style={{ color: "red" }}>Total Expenses: {spentamount}</span>
				</div>
				<div style={{ marginRight: "40rem" }}>
					<Doughnut
						data={{
							labels: ["Spent", "Budget"],
							datasets: [
								{
									data: [percent, 100 - percent],
									backgroundColor: ["#FF6384", "#36A2EB"],
									hoverBackgroundColor: ["#FF6384", "#36A2EB"]
								}
							]
						}}
						options={{
							maintainAspectRatio: false,
							responsive: true,
							legend: {
								text: this.state.budgetAmount,
								postion: "right",
								display: false
							},
							elements: {
								center: {
									text: Math.round(percent) + "% spent",
									color: "red",
									fontStyle: "Helvetica",
									sidePadding: 15
								}
							}
						}}
					/>
				</div>
			</div>
		);
	}
}

export default BudgetChart;

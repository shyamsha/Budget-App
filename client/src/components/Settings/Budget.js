import React, { Component } from "react";
import axios from "../../config/config";
import BudgetForm from "./BudgetFrom";
import "antd/dist/antd.css";
import { Form, Button } from "antd";
class Budget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			budgetAmount: 0,
			key: ""
		};
	}
	componentDidMount() {
		axios
			.get("/budget", {
				headers: { "x-auth": localStorage.getItem("token") }
			})
			.then(response => {
				let budget = 0;
				let key = "";
				response.data.forEach(amount => {
					budget = amount.budgetAmount;
					key = amount._id;
				});
				this.setState(() => ({ budgetAmount: budget, key: key }));
			})
			.catch(err => {
				console.log(err);
			});
	}
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const formData = values.budgetAmount;
				axios
					.put(`/budget/${this.state.key}`, formData, {
						headers: { "x-auth": localStorage.getItem("token") }
					})
					.then(response => {
						console.log(response.data);
					})
					.catch(err => {
						console.log(err);
					});
			}
		});
	};

	budgetAmount = (rule, value, callback) => {
		if (value.budgetAmount > 0) {
			callback();
			return;
		}
		callback("Price must greater than zero!");
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="BudgetAmount">
						{getFieldDecorator("budgetAmount", {
							initialValue: { budgetAmount: this.state.budgetAmount },
							rules: [{ validator: this.budgetAmount }]
						})(<BudgetForm />)}
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Update
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
const WrappedBudget = Form.create({ name: "customized_form_controls" })(Budget);
export default WrappedBudget;

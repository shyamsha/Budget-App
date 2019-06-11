import React, { Component } from "react";
import axios from "../../config/config";
import { Modal, Form, Input, InputNumber, Select } from "antd";
const { Option } = Select;
const ExpenseCreateForm = Form.create({ name: "form_in_modal" })(
	// eslint-disable-next-line
	class extends Component {
		constructor() {
			super();
			this.state = {
				categories: []
			};
		}
		componentDidMount() {
			axios
				.get("/categories")
				.then(response => {
					this.setState(() => ({ categories: response.data }));
				})
				.catch(err => {
					console.log(err);
				});
		}
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Create a new Expense"
					okText="Create"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form layout="vertical">
						<Form.Item label="Name">
							{getFieldDecorator("itemName", {
								rules: [
									{
										required: true,
										message: "Please input the name of item!"
									}
								]
							})(<Input style={{ width: 480 }} />)}
						</Form.Item>
						<Form.Item label="Amount">
							{getFieldDecorator("amount", {
								rules: [
									{
										required: true,
										message: "Please input the amount greater than zero!"
									}
								]
							})(<InputNumber min={1} style={{ width: 480 }} />)}
						</Form.Item>
						<Form.Item label="Category">
							{getFieldDecorator("category", {
								rules: [
									{
										required: true,
										message: "Please select the category!"
									}
								]
							})(
								<Select placeholder="Select a Category" style={{ width: 480 }}>
									{this.state.categories.map(cat => {
										return (
											<Option key={cat._id} value={cat._id}>
												{cat.category}
											</Option>
										);
									})}
								</Select>
							)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	}
);
export default ExpenseCreateForm;

import React, { Component } from "react";
import axios from "../../config/config";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
const { Option } = Select;
const ExpenseCreateForm = Form.create({ name: "form_in_modal" })(
	// eslint-disable-next-line

	class extends Component {
		constructor() {
			super();
			this.state = {
				categories: [],
				file: null
			};
		}
		componentDidMount() {
			axios
				.get("/categories", {
					headers: { "x-auth": localStorage.getItem("token") }
				})
				.then(response => {
					this.setState(() => ({ categories: response.data }));
				})
				.catch(err => {
					console.log(err);
				});
		}
		fileHandle = e => {
			console.log(e.target.files[0]);
		};
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			const props = {
				name: "file",
				action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
				headers: {
					authorization: "authorization-text"
				},
				onChange(info) {
					if (info.file.status !== "uploading") {
						console.log(info.file, info.fileList);
					}
					if (info.file.status === "done") {
						message.success(`${info.file.name} file uploaded successfully`);
					} else if (info.file.status === "error") {
						message.error(`${info.file.name} file upload failed.`);
					}
				}
			};
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
						<Form.Item label="Invoice">
							{getFieldDecorator("imageUrl", {
								valuePropName: "file",
								getValueFromEvent: this.file
							})(
								<Input type="file" onChange={this.fileHandle} />
								// <Upload {...props}>
								// 	<Button>
								// 		<Icon type="upload" /> Upload Invoice
								// 	</Button>
								// </Upload>
							)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	}
);
export default ExpenseCreateForm;

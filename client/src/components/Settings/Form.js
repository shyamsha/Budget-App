import React, { Component } from "react";
// import axios from "../../config/config";
import { Modal, Form, Input } from "antd";

const CategoryCreateForm = Form.create({ name: "form_in_modal" })(
	// eslint-disable-next-line
	class extends Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Create a new Category"
					okText="Create"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form layout="vertical">
						<Form.Item label="Name">
							{getFieldDecorator("category", {
								rules: [
									{
										required: true,
										message: "Please input the name of category!"
									}
								]
							})(<Input style={{ width: 380 }} />)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	}
);
export default CategoryCreateForm;

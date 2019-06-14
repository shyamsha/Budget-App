/* eslint-disable no-script-url */
import React, { Component } from "react";
import Budget from "./Budget";
import axios from "../../config/config";
import "antd/dist/antd.css";
import { Table, Popconfirm, Button } from "antd";
import CategoryCreateForm from "./Form";

class Categories extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			visible: false
		};
		this.columns = [
			{
				title: "Category",
				dataIndex: "name",
				width: "30%"
			},

			{
				title: "Action",
				dataIndex: "delete",
				render: (text, record) =>
					this.state.categories.length >= 1 ? (
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => this.handleDelete(record.key)}
						>
							{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
							<a href="javascript:;">Delete</a>
						</Popconfirm>
					) : null
			}
		];
	}
	componentDidMount() {
		axios
			.get("categories")
			.then(response => {
				const data = [];
				response.data.forEach(category => {
					data.push({
						key: category._id,
						name: category.category
					});
				});
				this.setState(() => ({ categories: data }));
			})
			.catch(err => {
				console.log(err);
			});
	}
	handleDelete = key => {
		axios
			.delete(`categories/${key}`)
			.then(response => {
				// console.log(response.data);
			})
			.catch(err => {
				console.log(err);
			});
		const categories = [...this.state.categories];
		this.setState({ categories: categories.filter(item => item.key !== key) });
	};

	showModal = () => {
		this.setState({ visible: true });
	};
	handleCancel = () => {
		this.setState({ visible: false });
	};

	handleCreate = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			axios
				.post("/categories", values)
				.then(response => {
					this.setState(prevState => {
						return {
							categories: [
								...prevState.categories,
								{
									key: response.data._id,
									name: response.data.category
								}
							]
						};
					});
				})
				.catch(err => {
					console.log(err);
				});
			form.resetFields();
			this.setState({ visible: false });
		});
	};
	saveFormRef = formRef => {
		this.formRef = formRef;
	};
	render() {
		const { categories } = this.state;
		console.log(categories);
		return (
			<div>
				<center style={{ marginTop: "1rem" }}>
					<div>
						<Budget />
					</div>
				</center>
				<center style={{ marginTop: "4rem" }}>
					<div>
						<Button
							type="primary"
							style={{ marginLeft: "13rem" }}
							onClick={this.showModal}
						>
							Add Category
						</Button>
						<CategoryCreateForm
							wrappedComponentRef={this.saveFormRef}
							visible={this.state.visible}
							onCancel={this.handleCancel}
							onCreate={this.handleCreate}
						/>
						<br />
						<br />
						<Table
							style={{ width: "352px" }}
							dataSource={categories}
							columns={this.columns}
							size="small"
						/>
					</div>
				</center>
			</div>
		);
	}
}

export default Categories;

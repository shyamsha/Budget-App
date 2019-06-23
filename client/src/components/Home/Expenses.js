/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import axios from "../../config/config";
import ExpenseCreateForm from "./Form";
import BudgetChart from "./BudgetChart";
import CategoryChart from "./CategoryChart";
import "antd/dist/antd.css";
import { Table, Input, InputNumber, Popconfirm, Button, Form } from "antd";

const EditableContext = React.createContext();

class EditableCell extends Component {
	getInput = () => {
		if (this.props.inputType === "number") {
			return <InputNumber />;
		}
		return <Input />;
	};

	renderCell = ({ getFieldDecorator }) => {
		const {
			editing,
			dataIndex,
			title,
			inputType,
			record,
			index,
			children,
			...restProps
		} = this.props;

		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item style={{ margin: 0 }}>
						{getFieldDecorator(dataIndex, {
							rules: [
								{
									required: true,
									message: `Please Input ${title}!`
								}
							],
							initialValue: record[dataIndex]
						})(this.getInput())}
					</Form.Item>
				) : (
					children
				)}
			</td>
		);
	};

	render() {
		return (
			<EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
		);
	}
}

class Expenses extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			editingKey: "",
			visible: false,
			categories: []
		};
		this.columns = [
			{
				title: "Category",
				dataIndex: "category",
				width: "25%",
				editable: false
			},
			{
				title: "Item Name",
				dataIndex: "itemName",
				width: "25%",
				editable: true
			},
			{
				title: "Amount",
				dataIndex: "amount",
				width: "15%",
				editable: true
			},
			{
				title: "ExpenseDate",
				dataIndex: "date",
				width: "20%",
				editable: false
			},
			{
				title: "Action",
				dataIndex: "edit",
				render: (text, record) => {
					const { editingKey } = this.state;
					const editable = this.isEditing(record);
					return editable ? (
						<span>
							<EditableContext.Consumer>
								{form => (
									<a
										href="javascript:;"
										onClick={() => this.save(form, record.key)}
										style={{ marginRight: 8 }}
									>
										Save
									</a>
								)}
							</EditableContext.Consumer>
							<Popconfirm
								title="Sure to cancel?"
								onConfirm={() => this.cancel(record.key)}
							>
								<a>Cancel</a>
							</Popconfirm>
						</span>
					) : (
						<a
							disabled={editingKey !== ""}
							onClick={() => this.edit(record.key)}
						>
							Edit
						</a>
					);
				}
			},
			{
				title: "Action",
				dataIndex: "delete",
				render: (text, record) =>
					this.state.data.length >= 1 ? (
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => this.handleDelete(record.key)}
						>
							<a href="javascript:;">Delete</a>
						</Popconfirm>
					) : null
			}
		];
	}
	isEditing = record => record.key === this.state.editingKey;

	cancel = () => {
		this.setState({ editingKey: "" });
	};

	save(form, key) {
		form.validateFields((error, row) => {
			if (error) {
				return;
			}
			axios
				.put(`expenses/${key}`, row, {
					headers: { "x-auth": localStorage.getItem("token") }
				})
				.then(response => {})
				.catch(err => {
					console.log(err);
				});
			const newData = [...this.state.data];
			const index = newData.findIndex(item => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row
				});
				this.setState({ data: newData, editingKey: "" });
			} else {
				newData.push(row);
				this.setState({ data: newData, editingKey: "" });
			}
		});
	}

	edit(key) {
		this.setState({ editingKey: key });
	}
	handleDelete = key => {
		axios
			.delete(`/expenses/${key}`, {
				headers: { "x-auth": localStorage.getItem("token") }
			})
			.then(response => {})
			.catch(err => {
				console.log(err);
			});
		const data = [...this.state.data];
		this.setState({ data: data.filter(item => item.key !== key) });
	};
	componentDidMount() {
		axios
			.get("/expenses", {
				headers: { "x-auth": localStorage.getItem("token") }
			})
			.then(response => {
				const data = [];
				response.data.forEach(expense => {
					const raw = Date.parse(expense.expenseDate) / 1000;
					const date = new Date(raw * 1000).toDateString();
					data.push({
						key: expense._id,
						itemName: expense.itemName,
						amount: expense.amount,
						category: expense.category.category,
						date: date
					});
				});

				this.setState(() => ({
					data: data
				}));
			})
			.catch(err => {
				console.log(err);
			});
	}
	showModal = () => {
		this.setState({ visible: true });
	};
	handleCancel = () => {
		this.setState({ visible: false });
	};

	handleCreate = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			console.log(values);
			if (err) {
				return;
			}
			axios
				.post("/expenses", values, {
					headers: { "x-auth": localStorage.getItem("token") }
				})
				.then(response => {
					const raw = Date.parse(response.data.expense.expenseDate) / 1000;
					const date = new Date(raw * 1000).toDateString();

					this.setState(prevState => {
						return {
							data: [
								...prevState.data,
								{
									key: response.data.expense._id,
									itemName: response.data.expense.itemName,
									amount: response.data.expense.amount,
									category: response.data.category.category,
									date: date
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
	restore = () => {
		axios
			.put(
				"/expenses/undo",
				{},
				{
					headers: { "x-auth": localStorage.getItem("token") }
				}
			)
			.then(response => {
				const data = [];
				response.data.forEach(expense => {
					const raw = Date.parse(expense.expenseDate) / 1000;
					const date = new Date(raw * 1000).toDateString();
					data.push({
						key: expense._id,
						itemName: expense.itemName,
						amount: expense.amount,
						category: expense.category.category,
						date: date
					});
				});
				this.setState(prevState => {
					return {
						data: data
					};
				});
			})
			.catch(err => {
				console.log(err);
			});
	};

	render() {
		const components = {
			body: {
				cell: EditableCell
			}
		};
		const columns = this.columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					inputType: col.dataIndex === "age" ? "number" : "text",
					dataIndex: col.dataIndex,
					title: col.title,
					editing: this.isEditing(record)
				})
			};
		});
		return (
			<div>
				<div>
					<CategoryChart expenses={this.state.data} />
					<BudgetChart data={this.state.data} />
				</div>

				<div>
					<Button type="primary" onClick={this.showModal}>
						Add Expense
					</Button>
					<Button
						type="primary"
						style={{ float: "right" }}
						onClick={this.restore}
					>
						Restore Deleted Items
					</Button>
					<ExpenseCreateForm
						wrappedComponentRef={this.saveFormRef}
						visible={this.state.visible}
						onCancel={this.handleCancel}
						onCreate={this.handleCreate}
					/>
				</div>
				<br />
				<div>
					<EditableContext.Provider value={this.props.form}>
						<Table
							components={components}
							bordered
							dataSource={this.state.data}
							columns={columns}
							rowClassName="editable-row"
							pagination={{
								onChange: this.cancel
							}}
						/>
					</EditableContext.Provider>
				</div>
			</div>
		);
	}
}
const EditableFormTable = Form.create()(Expenses);
export default EditableFormTable;

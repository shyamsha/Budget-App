/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import axios from "../../config/config";
import "antd/dist/antd.css";
import { Table, Input, InputNumber, Popconfirm, Button, Form } from "antd";

const data = [];
// for (let i = 0; i < 5; i++) {
// 	data.push({
// 		key: i.toString(),
// 		category: "sHyaM",
// 		name: `Edrward ${i}`,
// 		amount: 32,
// 		date: `${Date.now()}${i}`
// 	});
// }

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
			expenses: [],
			data: data,
			editingKey: "",
			count: 2
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
				dataIndex: "name",
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
				title: "Actions",
				dataIndex: "operation",
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

	componentDidMount() {
		axios
			.get("/expenses")
			.then(response => {
				response.data.forEach(expense => {
					data.push({
						key: expense._id,
						name: expense.itemName,
						amount: expense.amount,
						category: expense.category.category,
						date: expense.expenseDate
					});
				});

				// console.log(response.data);
				this.setState(() => ({ expenses: response.data }));
			})
			.catch(err => {
				console.log(err);
			});
	}
	handleAdd = () => {
		const { count, data } = this.state;
		const newData = {
			key: count,
			category: "sHyaM",
			name: `Edward King ${count}`,
			amount: 32,
			date: `${Date.now()}${count}`
		};
		this.setState({
			data: [...data, newData],
			count: count + 1
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
				<EditableContext.Provider value={this.props.form}>
					<Button
						onClick={this.handleAdd}
						type="primary"
						style={{ marginBottom: 16 }}
					>
						Add Expense
					</Button>
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
		);
	}
}
const EditableFormTable = Form.create()(Expenses);
export default EditableFormTable;

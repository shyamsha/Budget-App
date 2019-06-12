import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input } from "antd";

class BudgetForm extends Component {
	static getDerivedStateFromProps(nextProps) {
		// Should be a controlled component.

		if ("value" in nextProps) {
			return {
				...(nextProps.value || {})
			};
		}
		return null;
	}

	constructor(props) {
		super(props);

		const value = props.value || {};
		this.state = {
			budgetAmount: value.budgetAmount || 0
		};
	}

	handleNumberChange = e => {
		const budgetAmount = parseInt(e.target.value || 0, 10);
		console.log(e.target.value);
		if (Number.isNaN(budgetAmount)) {
			return;
		}
		if (!("value" in this.props)) {
			this.setState({ budgetAmount });
		}
		this.triggerChange({ budgetAmount });
	};

	triggerChange = changedValue => {
		// Should provide an event to pass value to Form.

		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue));
		}
	};

	render() {
		const state = this.state;
		return (
			<span>
				<Input
					type="text"
					value={state.budgetAmount}
					onChange={this.handleNumberChange}
					style={{ width: "95%", marginRight: "1%" }}
				/>
			</span>
		);
	}
}

export default BudgetForm;

const mongoose = require("mongoose");

const { Schema } = mongoose;
const expensesSchema = new Schema({
	itemName: {
		type: String,
		requrired: true
	},
	amount: {
		type: String,
		requrired: true
	},
	expenseDate: {
		type: Date,
		default: Date.now
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true
	},
	isDelete: {
		type: Boolean,
		required: true,
		default: false
	},
	imageUrl: {
		type: String
		// required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});
const Expense = mongoose.model("Expense", expensesSchema);
module.exports = {
	Expense
};

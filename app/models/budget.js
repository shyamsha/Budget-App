const mongoose = require("mongoose");

const { Schema } = mongoose;
const budgetSchema = new Schema({
	budgetAmount: {
		type: Number,
		requrired: true,
		default: 0
	}
});
const Budget = mongoose.model("Budget", budgetSchema);
module.exports = {
	Budget
};

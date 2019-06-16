const mongoose = require("mongoose");

const { Schema } = mongoose;
const budgetSchema = new Schema({
	budgetAmount: {
		type: Number,
		requrired: true,
		default: 0
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});
const Budget = mongoose.model("Budget", budgetSchema);
module.exports = {
	Budget
};

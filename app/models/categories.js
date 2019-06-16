const mongoose = require("mongoose");

const { Schema } = mongoose;
const categorySchema = new Schema({
	category: {
		type: String,
		requrired: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});
const Category = mongoose.model("Category", categorySchema);
module.exports = {
	Category
};

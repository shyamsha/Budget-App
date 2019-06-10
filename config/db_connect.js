//db configuration
const mongoose = require("mongoose");
const path = "mongodb://localhost:27017/budget";
const connection_uri =
	process.env.MONGODB_URI ||
	"mongodb+srv://sHyaM:9849084994@thread-7qrsu.mongodb.net/thread?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose
	.connect(path, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log("db connected succefully");
	})
	.catch(err => {
		console.log("Error connecting to DB", err);
	});
module.exports = {
	mongoose
};

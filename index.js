const express = require("express");
const cors = require("cors");
const app = express();
// const path = require("path");
// const port = 3001;

require("dotenv").config();
const path = require("path");
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
//db config
const mongoose = require("./config/db_connect");

const { userController } = require("./app/controllers/user_controller");
const { budgetController } = require("./app/controllers/budget_controller");
const { categoryController } = require("./app/controllers/category_controller");
const { expenseController } = require("./app/controllers/expense_controller");
app.use(express.static(path.join(__dirname, "client/build")));
//route urls
app.use("/users", userController);
app.use("/budget", budgetController);
app.use("/categories", categoryController);
app.use("/expenses", expenseController);

app.get("/", (req, res) => {
	res.send("Welcome to your Budget Expensives");
});
//default route
app.use(function(req, res) {
	res
		.status(404)
		.send(
			"The resource you are looking for doesn’t exist." + "\n 404 Not Found "
		);
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
//listening server
app.listen(port, () => {
	console.log("listining from", port);
});

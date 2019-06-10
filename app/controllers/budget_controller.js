const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { Budget } = require("../models/budget");

router.get("/", (req, res) => {
	Budget.find()
		.then(budget => {
			res.send(budget);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/", (req, res) => {
	const budget = new Budget(req.body);
	budget
		.save()
		.then(budget => {
			res.send(budget);
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/:id", (req, res) => {
	Budget.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ new: true }
	)
		.then(budget => {
			res.send(budget);
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = {
	budgetController: router
};

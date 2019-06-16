const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { Budget } = require("../models/budget");

router.get("/", authenticationByUser, (req, res) => {
	Budget.find({ user: req.user._id })
		.then(budget => {
			res.send(budget);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/", authenticationByUser, (req, res) => {
	const budget = new Budget(req.body);
	budget.user = req.user._id;
	budget
		.save()
		.then(budget => {
			res.send(budget);
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/:id", authenticationByUser, (req, res) => {
	Budget.findOneAndUpdate(
		{ _id: req.params.id, user: req.user._id },
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

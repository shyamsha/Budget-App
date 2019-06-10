const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { Category } = require("../models/categories");

router.get("/", (req, res) => {
	Category.find()
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/", (req, res) => {
	const category = new Category(req.body);
	category
		.save()
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/:id", (req, res) => {
	Category.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ new: true }
	)
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/:id", (req, res) => {
	Category.findOneAndDelete({ _id: req.params.id })
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = {
	categoryController: router
};

const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { Category } = require("../models/categories");

router.get("/", authenticationByUser, (req, res) => {
	Category.find({ user: req.user._id })
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/", authenticationByUser, (req, res) => {
	const category = new Category(req.body);
	category.user = req.user._id;
	category
		.save()
		.then(category => {
			res.send(category);
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/:id", authenticationByUser, (req, res) => {
	Category.findOneAndUpdate(
		{ _id: req.params.id, user: req.user._id },
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
router.delete("/:id", authenticationByUser, (req, res) => {
	Category.findOneAndDelete({ _id: req.params.id, user: req.user._id })
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

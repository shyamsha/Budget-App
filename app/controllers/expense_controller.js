const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { Expense } = require("../models/expenses");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const path = require("path");
const { Category } = require("../models/categories");
//var upload = multer({ dest: "uploads/" }); //anthor way to upload
aws.config.update({
	secretAccessKey: process.env.SECRETACCESS_KEY,

	accessKeyId: process.env.ACCESS_KEYID,
	region: "us-east-1"
});

const s3 = new aws.S3();

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: "monthly-commerce",
		acl: "public-read",
		metadata: function(req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function(req, file, cb) {
			cb(null, Date.now().toString() + file.originalname);
		}
	})
});

router.get("/", (req, res) => {
	Expense.find({ isDelete: false })

		.populate("category")
		.then(expense => {
			res.send(expense);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/", upload.single("imageUrl"), (req, res) => {
	// imageUrl: req.file.location;
	// console.log(req.file);
	const expense = new Expense({
		itemName: req.body.itemName,
		amount: req.body.amount,
		category: req.body.category,
		imageUrl: req.body.imageUrl
	});
	expense
		.save()
		.then(expense => {
			const raw = Date.parse(expense.expenseDate) / 1000;
			const date = new Date(raw * 1000).toDateString();
			expense.expenseDate = date;
			Category.findById(expense.category).then(category => {
				res.send({
					expense,
					category
				});
			});
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/:id", (req, res) => {
	Expense.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ new: true }
	)
		.then(expense => {
			res.send(expense);
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	Expense.findOneAndUpdate(
		{ _id: id },
		{ $set: { isDelete: true } },
		{ new: true }
	).then(expense => {
		res.send(expense);
	});
});
module.exports = {
	expenseController: router
};

const express = require("express");
const router = express.Router();
const { authenticationByUser } = require("../middlewares/authenticate");
const { autherizationByUser } = require("../middlewares/autherization");
const { User } = require("../models/user");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const path = require("path");

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

router.post("/register", upload.single("imageUrl"), (req, res) => {
	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		occupation: req.body.occupation,
		imageUrl: req.file.location
	});
	user
		.save()
		.then(user => {
			res.send(user);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/login", (req, res) => {
	const body = req.body;

	User.findByCredentials(body.email, body.password)
		.then(user => {
			return user.generateByToken();
			//res.send(" successfully logedin ");
		})
		.then(token => {
			//res.header("x-auth", token).send();
			res.send(token);
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/logout", authenticationByUser, (req, res) => {
	const tokenData = req.token;

	User.findOneAndUpdate(req.user._id, {
		$pull: { tokens: { token: tokenData } }
	})
		.then(user => {
			user.save().then(user => {
				res.send({ statusText: "suceessfully logout" });
			});
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/:id", authenticationByUser, (req, res) => {
	User.findOne({ _id: req.params.id })
		.then(user => {
			res.send(user);
		})
		.catch(err => {
			res.send(err);
		});
});
module.exports = {
	userController: router
};

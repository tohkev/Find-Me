const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
	"/signup",
	fileUpload.single("image"),
	[
		check("name").not().isEmpty().withMessage("must not be empty"),
		check("password")
			.isLength({ min: 9 })
			.withMessage("must be at least 9 characters"),
		check("email")
			.normalizeEmail()
			.isEmail()
			.withMessage("must not be empty"),
	],
	usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;

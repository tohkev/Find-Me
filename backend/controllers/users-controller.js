const HttpError = require("../models/http-error");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const DUMMY_USERS = [
	{
		id: "u1",
		name: "Kevin To",
		password: "wowowowyeyeyey",
		email: "bigtoh@email.com",
	},
	{
		id: "u2",
		name: "Ann Jo",
		password: "supersafe",
		email: "macanncheez@mail.com",
	},
];

async function getUsers(req, res, next) {
	let users;

	try {
		users = await User.find({}, "-password");
	} catch (err) {
		const error = new HttpError(
			"Issue with fetching users, please try again.",
			500
		);
		return next(error);
	}

	if (!users || users.length === 0) {
		const error = new HttpError("No users found", 404);
		next(error);
	}

	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

async function signup(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessage = errors.errors.map(
			(error) => `${error.param} ${error.msg}`
		);
		return next(new HttpError(errorMessage, 422));
	}

	const { name, password, email, places } = req.body;

	let existingEmail;

	try {
		existingEmail = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Issue with verifying email, please try again.",
			500
		);
		return next(error);
	}

	if (existingEmail) {
		const error = new HttpError(
			"User already exists, please login instead.",
			422
		);
		return next(error);
	}

	const newUser = new User({
		name,
		password,
		email,
		image: "https://i.stack.imgur.com/34AD2.jpg",
		places,
	});

	try {
		await newUser.save();
	} catch (err) {
		const error = new HttpError("Sign up failed, please try again.", 500);
		return next(error);
	}

	res.status(201).json({ user: newUser.toObject({ getters: true }) });
}

async function login(req, res, next) {
	const { email, password } = req.body;

	let foundUser;

	try {
		foundUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Issue with logging in, please try again.",
			500
		);
		return next(error);
	}

	if (!foundUser || foundUser.password !== password) {
		return next(
			new HttpError(
				"Could not identify user with those credentials.",
				401
			)
		);
	}

	res.json({ message: "Logged in!" });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

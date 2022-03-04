const HttpError = require("../models/http-error");
const { nanoid } = require("nanoid");

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

function getUsers(req, res, next) {
	if (!DUMMY_USERS || DUMMY_USERS.length === 0) {
		return next(new HttpError("No users found.", 404));
	}

	res.json({ users: DUMMY_USERS });
}

function signup(req, res, next) {
	const { name, password, email } = req.body;

	const existingEmail = DUMMY_USERS.find((user) => user.email === email);

	if (existingEmail) {
		return next(
			new HttpError("Could not create user, email already exists", 422)
		);
	}

	const newUser = {
		id: nanoid(),
		name,
		password,
		email,
	};
	DUMMY_USERS.push(newUser);

	res.status(201).json({ user: newUser });
}

function login(req, res, next) {
	const { email, password } = req.body;
	const foundUser = DUMMY_USERS.find((user) => user.email === email);
	if (!foundUser || foundUser.password !== password) {
		return next(
			new HttpError("Could not identify user with those credentials")
		);
	}

	res.json({ message: "Logged in!" });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

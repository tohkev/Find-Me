const HttpError = require("../models/http-error");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");

const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");

async function getPlaceById(req, res, next) {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			"Issue with retrieving place, please try again.",
			500
		);
		return next(error);
	}

	if (!place) {
		//if used in a synchronous operation, you can throw instead of next
		return next(new HttpError("Could not find a place with that ID", 404));
	}

	//setting getters to true allows us to get the ID property provided by mongo
	res.json({ place: place.toObject({ getters: true }) });
}

async function getPlacesByUserId(req, res, next) {
	const userId = req.params.uid;

	let places;
	try {
		places = await Place.find({ creator: userId });
	} catch (err) {
		const error = new HttpError(
			"Issue with getting user places, please try again.",
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"User does not have any places or does not exist.",
				404
			)
		);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
}

async function createPlace(req, res, next) {
	//validiationResult checks the req to see if there are any validation errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const errorMessage = errors.errors.map(
			(error) => `${error.param} ${error.msg}`
		);
		return next(new HttpError(errorMessage, 422));
	}

	const { title, description, address, creator } = req.body;

	let coordinates;

	try {
		coordinates = await getCoordsFromAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: "https://media.istockphoto.com/photos/silhouette-of-person-in-the-airport-picture-id494216846?k=20&m=494216846&s=612x612&w=0&h=H8NFCE0oAAe2gDU06mNiRIcQxHRNuDd8ooxvEWrEzm0=",
		creator,
	});

	try {
		await createdPlace.save();
	} catch (err) {
		const error = new HttpError(
			"Failed to add place, please try again.",
			500
		);
		return next(error);
	}

	res.status(201).json(createdPlace);
}

async function updatePlace(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessage = errors.errors.map(
			(error) => `${error.param} ${error.msg}`
		);
		return next(new HttpError(errorMessage, 422));
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	const filter = { id: placeId };
	const updateProp = { title: title, description: description };
	let updatedPlace;

	try {
		updatedPlace = await Place.findOneAndUpdate(filter, updateProp, {
			new: true,
		});
	} catch (err) {
		const error = new HttpError(
			"Issue with updating place, please try again.",
			500
		);
		return next(error);
	}

	res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findByIdAndDelete(placeId);
	} catch (err) {
		const error = new HttpError(
			"Issue with deleting place, please try again",
			500
		);
		return next(error);
	}

	res.status(200).json({ message: "Deleted place." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

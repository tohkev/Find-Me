const HttpError = require("../models/http-error");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");

const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most famous skyscrapers in the world",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
		address: "20 W 34th St, New York, NY 10001",
		creator: "u1",
		location: {
			lat: 40.7484405,
			lng: -73.9878531,
		},
	},
];

function getPlaceById(req, res, next) {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((place) => placeId === place.id);
	if (!place) {
		//if used in a synchronous operation, you can throw instead of next
		return next(new HttpError("Could not find a place with that ID", 404));
	}

	res.json({ place });
}

function getPlacesByUserId(req, res, next) {
	const userId = req.params.uid;
	const places = DUMMY_PLACES.filter((place) => place.creator === userId);

	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"User does not have any places or does not exist.",
				404
			)
		);
	}

	res.json({ places });
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

function updatePlace(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessage = errors.errors.map(
			(error) => `${error.param} ${error.msg}`
		);
		return next(new HttpError(errorMessage, 422));
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;
	const updatedPlace = {
		...DUMMY_PLACES.find((place) => place.id === placeId),
	};
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatedPlace.title = title;
	updatedPlace.description = description;
	DUMMY_PLACES[placeIndex] = updatedPlace;

	res.status(200).json({ place: updatedPlace });
}

function deletePlace(req, res, next) {
	const placeId = req.params.pid;
	if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
		return next(new HttpError("Could not find a place with that ID"));
	}

	DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);

	res.status(200).json({ message: "Deleted place." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

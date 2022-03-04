const HttpError = require("../models/http-error");
const { nanoid } = require("nanoid");

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

function createPlace(req, res, next) {
	const { title, description, coordinates, address, creator } = req.body;
	const createdPlace = {
		id: nanoid(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};
	DUMMY_PLACES.push(createdPlace);

	res.status(201).json(createdPlace);
}

function updatePlace(req, res, next) {
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
	DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);

	res.status(200).json({ message: "Deleted place." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

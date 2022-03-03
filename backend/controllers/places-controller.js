const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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
	{
		id: "p2",
		title: "Statue of Liberty",
		description: "Iconic statue in New York",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
		address: "20 W 34th St, New York, NY 10001",
		creator: "u2",
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

	if (places.length === 0) {
		return next(
			new HttpError(
				"User does not have any places or does not exist.",
				404
			)
		);
	}

	res.json({ places });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;

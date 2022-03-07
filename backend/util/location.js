const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "YOUR API KEY HERE";

async function getCoordsFromAddress(address) {
	const response = await axios.get(
		`http://open.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${encodeURIComponent(
			address
		)}`
	);

	const data = response.data;

	if (!data || data.info.statuscode !== 0) {
		const error = new HttpError("Error getting data", 404);
		throw error;
	}

	const coordinates = data.results[0].locations[0].latLng;
	return coordinates;
}

module.exports = getCoordsFromAddress;

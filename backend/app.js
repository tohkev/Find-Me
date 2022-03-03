const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

//filters to only paths that have /api/places
app.use("/api/places", placesRoutes);

//this is executed on only requests with an error thrown
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "Something went wrong!" });
});

app.listen(5000, () => {
	console.log("Listening on port 5000");
});

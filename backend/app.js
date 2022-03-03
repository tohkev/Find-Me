const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

//filters to only paths that have /api/places
app.use("/api/places", placesRoutes);

app.listen(5000, () => {
	console.log("Listening on port 5000");
});

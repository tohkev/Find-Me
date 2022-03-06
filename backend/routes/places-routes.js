const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

//check is a middleware that validates if a field meets certain conditions (title is not empty or description meets minimum length in this case)
router.post(
	"/",
	[
		check("title").not().isEmpty().withMessage("must not be empty"),
		check("description")
			.isLength({ min: 5 })
			.withMessage("must have at least 5 characters"),
		check("address").not().isEmpty().withMessage("must not be empty"),
	],
	placesControllers.createPlace
);

router.patch(
	"/:pid",
	[
		check("title").not().isEmpty().withMessage("must not be empty"),
		check("description")
			.isLength({ min: 5 })
			.withMessage("must have at least 5 characters"),
	],
	placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;

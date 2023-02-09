const multer = require("multer");
const { nanoid } = require("nanoid");

const { storage } = require("../util/cloudinaryConfig");

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpeg",
};

const fileUpload = multer({
	//size limit of the file being stored
	limits: 500000,
	//how the data is stored on the multer disk storage driver
	storage: storage,
	//validates the file type
	fileFilter: (req, file, callback) => {
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		let error = isValid ? null : new Error("Invalid mime type!");
		callback(error, isValid);
	},
});

module.exports = fileUpload;

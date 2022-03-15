const multer = require("multer");
const { nanoid } = require("nanoid");

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpg": "jpg",
	"image/jpeg": "jpeg",
};

const fileUpload = multer({
	//size limit of the file being stored
	limits: 500000,
	//how the data is stored on the multer disk storage driver
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			//this will save the image into a folder uploads/images
			callback(null, "uploads/images");
		},
		filename: (req, file, callback) => {
			const extension = MIME_TYPE_MAP[file.mimetype];
			callback(null, `${nanoid()}.${extension}`);
		},
	}),
	//validates the file type
	fileFilter: (req, file, callback) => {
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		let error = isValid ? null : new Error("Invalid mime type!");
		callback(error, isValid);
	},
});

module.exports = fileUpload;

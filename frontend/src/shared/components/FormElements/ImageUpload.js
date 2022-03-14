import React from "react";

import Button from "./Button";
import "./ImageUpload.css";

function ImageUpload(props) {
	const [file, setFile] = React.useState();
	const [previewUrl, setPreviewUrl] = React.useState();
	const [isValid, setIsValid] = React.useState();

	const filePickerRef = React.useRef();

	React.useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	function pickImageHandler() {
		filePickerRef.current.click();
	}

	function pickedHandler(event) {
		let pickedFile;
		let fileIsValid = isValid;
		if (event.target.files || event.target.files.length === 1) {
			pickedFile = event.target.files[0];
			setFile(pickedFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}
		props.onInput(props.id, pickedFile, fileIsValid);
	}

	return (
		<div className="form-control">
			<input
				id={props.id}
				style={{ display: "none" }}
				type="file"
				accept=".jpg,.png,.jpeg"
				ref={filePickerRef}
				onChange={pickedHandler}
			/>
			<div className={`image-upload ${props.center && "center"}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="Preview" />}
					{!previewUrl && <p>Please pick an image.</p>}
				</div>
				<Button type="button" onClick={pickImageHandler}>
					Pick Image
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
}

export default ImageUpload;

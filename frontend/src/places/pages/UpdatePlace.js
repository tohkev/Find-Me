import React from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PlaceForm.css";

function UpdatePlace() {
	const [identifiedPlace, setIdentifiedPlace] = React.useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();
	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const placeId = useParams().placeId;
	// const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

	React.useEffect(() => {
		async function getPlace() {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/${placeId}`
				);
				setIdentifiedPlace(responseData.place);
			} catch (err) {}
		}
		getPlace();
	}, [sendRequest, placeId]);

	React.useEffect(() => {
		if (identifiedPlace) {
			setFormData(
				{
					title: {
						value: identifiedPlace.title,
						isValid: true,
					},
					description: {
						value: identifiedPlace.description,
						isValid: true,
					},
				},
				true
			);
		}
	}, [setFormData, identifiedPlace]);

	async function updatePlaceSubmitHandler(event) {
		event.preventDefault();
		try {
			await sendRequest(
				`http://localhost:5000/api/places/${placeId}`,
				"PATCH",
				{
					"Content-Type": "application/json",
				},
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				})
			);
		} catch (err) {}
		console.log(formState.inputs);
		history.push("/");
	}

	if (!identifiedPlace && !isLoading) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find a place</h2>
				</Card>
			</div>
		);
	}

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && formState.inputs.title.value && (
				<form
					className="place-form"
					onSubmit={updatePlaceSubmitHandler}
				>
					<Input
						id="title"
						element="input"
						type="text"
						label="Title"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a valid title."
						initialValue={formState.inputs.title.value}
						onInput={inputHandler}
						initialValid={formState.inputs.title.isValid}
					/>
					<Input
						id="description"
						element="textarea"
						label="Description"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid description (at least 5 characters)."
						initialValue={formState.inputs.description.value}
						onInput={inputHandler}
						initialValid={formState.inputs.description.isValid}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
}

export default UpdatePlace;

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
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

function UpdatePlace() {
	const auth = React.useContext(AuthContext);
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
					`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
				);
				setIdentifiedPlace(responseData.place);
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
			} catch (err) {}
		}
		getPlace();
	}, [sendRequest, placeId, setFormData]);

	if (isLoading) {
		return (
			<div className="center">
				<h2>
					<LoadingSpinner />
				</h2>
			</div>
		);
	}

	async function updatePlaceSubmitHandler(event) {
		event.preventDefault();
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
				"PATCH",
				{
					"Content-Type": "application/json",
					Authorization: `Bearer: ${auth.token}`,
				},
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				})
			);
			history.push(`/${auth.userId}/places`);
		} catch (err) {}
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

	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{!isLoading && identifiedPlace && (
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
						onInput={inputHandler}
						initialValue={identifiedPlace.title}
						initialValid={true}
					/>
					<Input
						id="description"
						element="textarea"
						label="Description"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid description (at least 5 characters)."
						onInput={inputHandler}
						initialValue={identifiedPlace.description}
						initialValid={true}
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

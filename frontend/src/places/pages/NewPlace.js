import React from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceForm.css";

function NewPlace() {
	const auth = React.useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
			address: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	//handles the form submission
	async function placeSubmitHandler(event) {
		event.preventDefault();
		try {
			await sendRequest(
				"http://localhost:5000/api/places",
				"POST",
				{
					"Content-Type": "application/json",
				},
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
					creator: auth.userId,
				})
			);
			//After submission of a new place, the use will be redirected to /
			history.push("/");
		} catch (err) {}
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className="place-form" onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id="title"
					element="input"
					type="text"
					placeholder="Enter title"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid title."
					onInput={inputHandler}
				/>
				<Input
					id="description"
					element="textarea"
					label="Description"
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description (at least 5 characters)."
					onInput={inputHandler}
				/>
				<Input
					id="address"
					element="input"
					type="text"
					placeholder="Enter address"
					label="Address"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid address."
					onInput={inputHandler}
				/>
				<Button type="submit" disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
}

export default NewPlace;

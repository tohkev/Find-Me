import React from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { AuthContext } from "../../shared/context/auth-context";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./Auth.css";

function Auth() {
	const auth = React.useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = React.useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	async function authSubmitHandler(event) {
		event.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/login",
					"POST",
					{
						"Content-Type": "application/json",
					},
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					})
				);
				auth.login(responseData.user.id);
			} catch (err) {
				//would not need to do anything in this block because the http hook will throw an error
				// and login will not occur if there is an error
				console.log(err);
			}
		} else {
			try {
				//formData is used to store data that JSON cannot (images)
				const formData = new FormData();
				formData.append("email", formState.inputs.email.value);
				formData.append("name", formState.inputs.name.value);
				formData.append("password", formState.inputs.password.value);
				formData.append("image", formState.inputs.image.value);
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/signup",
					"POST",
					{},
					//formData automatically sets the headers
					formData
				);
				auth.login(responseData.user.id);
			} catch (err) {
				console.log(err);
			}
		}
	}

	function switchModeHandler() {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined,
				},
				formState.inputs.email.isValid &&
					formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: "",
						isValid: false,
					},
					image: {
						value: null,
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	}

	return (
		<React.Fragment>
			<ErrorModal onClear={clearError} error={error} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>{isLoginMode ? "Log In" : "Sign Up"} to continue</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter your name."
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload center id="image" onInput={inputHandler} />
					)}
					<Input
						id="email"
						element="input"
						type="email"
						label="E-mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						id="password"
						element="input"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(9)]}
						errorText="Please enter a valid password (at least 9 characters)."
						onInput={inputHandler}
					/>
					<Button
						onClick={authSubmitHandler}
						type="submit"
						disabled={!formState.isValid}
					>
						{isLoginMode ? "Log In" : "Sign Up"}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					Switch to {isLoginMode ? "Sign Up" : "Log In"}
				</Button>
			</Card>
		</React.Fragment>
	);
}

export default Auth;

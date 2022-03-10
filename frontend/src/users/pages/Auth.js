import React from "react";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

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
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

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
		} else {
			try {
				setIsLoading(true);
				const response = await fetch(
					"http://localhost:5000/api/users/signup",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: formState.inputs.name.value,
							email: formState.inputs.email.value,
							password: formState.inputs.password.value,
						}),
					}
				);
				//returns a promise which is parsed in JSON
				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message);
				}
				console.log(responseData);
				setIsLoading(false);
				auth.login();
			} catch (err) {
				console.log(err);
				setIsLoading(false);
				setError(
					err.message || "Something went wrong, please try again."
				);
			}
		}
	}

	function switchModeHandler() {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
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
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	}

	function errorHandler() {
		setError(null);
	}

	return (
		<React.Fragment>
			<ErrorModal onClear={errorHandler} error={error} />
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
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid password."
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

//create an authentication (login) page
//using the useForm hook we created, create a form with an email and password that will be validated

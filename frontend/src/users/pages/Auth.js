import React from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

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
				await sendRequest(
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
				auth.login();
			} catch (err) {
				//would not need to do anything in this block because the http hook will throw an error
				// and login will not occur if there is an error
				console.log(err);
			}
		} else {
			try {
				await sendRequest(
					"http://localhost:5000/api/users/signup",
					"POST",
					{
						"Content-Type": "application/json",
					},
					JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					})
				);
				auth.login();
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

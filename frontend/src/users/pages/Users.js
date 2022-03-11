import React from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function Users() {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState();
	const [loadedUsers, setLoadedUsers] = React.useState([]);

	React.useEffect(() => {
		setIsLoading(true);

		async function sendRequest() {
			setIsLoading(true);
			try {
				const response = await fetch("http://localhost:5000/api/users");
				const responseData = await response.json();

				if (!response.ok) {
					throw new Error(responseData.message);
				}

				setLoadedUsers(responseData.users);
			} catch (err) {
				setError(err.message);
			}
			setIsLoading(false);
		}
		sendRequest();
		setIsLoading(false);
	}, []);

	function errorHandler() {
		setError(null);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={errorHandler} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UserList items={loadedUsers} />}
		</React.Fragment>
	);
}

export default Users;

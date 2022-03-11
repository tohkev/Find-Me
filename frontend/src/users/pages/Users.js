import React from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function Users() {
	const [loadedUsers, setLoadedUsers] = React.useState([]);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	React.useEffect(() => {
		async function getUsers() {
			try {
				const responseData = await sendRequest(
					"http://localhost:5000/api/users"
				);

				setLoadedUsers(responseData.users);
			} catch (err) {
				console.log(err);
			}
		}
		getUsers();
	}, [sendRequest]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
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

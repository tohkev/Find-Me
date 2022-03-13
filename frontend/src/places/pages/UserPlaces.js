import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

//useParams is a hook that gives access to the parameters (in this case we would need the userID from the URL)
//returns an object with the dynamic segments

function UserPlaces() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedPlaces, setLoadedPlaces] = React.useState([]);
	const userId = useParams().userId;

	function placeDeleteHandler(placeId) {
		setLoadedPlaces((prevPlaces) =>
			prevPlaces.filter((place) => place.id !== placeId)
		);
	}

	React.useEffect(() => {
		async function getUserPlaces() {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/user/${userId}`
				);
				setLoadedPlaces(responseData.places);
			} catch (err) {}
		}
		getUserPlaces();
	}, [sendRequest, userId]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedPlaces && (
				<PlaceList items={loadedPlaces} onDelete={placeDeleteHandler} />
			)}
		</React.Fragment>
	);
}

export default UserPlaces;

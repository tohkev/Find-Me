import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

//route allows you to render a certain component based on the url path
//redirect allows you to redirect the path when the one specified is unknown
//switch allows you to render only one route if that route applies (if none, then it will use redirect)

// import Users from "./users/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

//laxily rendering these path for code splitting
const Users = React.lazy(() => import("./users/pages/Users"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

function App() {
	const { token, login, logout, userId } = useAuth();

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact={true}>
					<Users />
				</Route>
				<Route path="/:userId/places" exact={true}>
					<UserPlaces />
				</Route>
				<Route path="/places/new" exact={true}>
					<NewPlace />
				</Route>
				<Route path="/places/:placeId" exact={true}>
					<UpdatePlace />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact={true}>
					<Users />
				</Route>
				<Route path="/:userId/places" exact={true}>
					<UserPlaces />
				</Route>
				<Route path="/auth" exact={true}>
					<Auth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				login: login,
				logout: logout,
			}}
		>
			<Router>
				<MainNavigation />
				<main>
					{
						<React.Suspense
							fallback={
								<div className="center">
									<LoadingSpinner />
								</div>
							}
						>
							{routes}
						</React.Suspense>
					}
				</main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;

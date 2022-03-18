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
import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

function App() {
	const [token, setToken] = React.useState(false);
	const [userId, setUserId] = React.useState(false);

	const login = React.useCallback((uid, token) => {
		setToken(token);
		setUserId(uid);
	}, []);

	const logout = React.useCallback(() => {
		setToken(null);
		setUserId(null);
	}, []);

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
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;

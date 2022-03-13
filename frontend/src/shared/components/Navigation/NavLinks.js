import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

//NavLink allows you to color the currently active link when you are current in that section
//useContext listens for the context that was set up in the app component
function NavLinks(props) {
	const auth = useContext(AuthContext);

	return (
		<ul className="nav-links">
			<li>
				<NavLink to="/" exact={true}>
					ALL USERS
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<li>
					<NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<NavLink to="/places/new">ADD PLACE</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<NavLink to="/logout" onClick={auth.logout}>
						LOG OUT
					</NavLink>
				</li>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to="/auth">AUTHENTICATE</NavLink>
				</li>
			)}
		</ul>
	);
}

export default NavLinks;

import React from "react";

let logoutTimer;

export function useAuth() {
	const [token, setToken] = React.useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = React.useState();
	const [userId, setUserId] = React.useState(false);

	const login = React.useCallback((uid, token, expirationDate) => {
		setToken(token);
		//tokens expire in 1 hour
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			"userData",
			JSON.stringify({
				userId: uid,
				token: token,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
		setUserId(uid);
	}, []);

	const logout = React.useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem("userData");
	}, []);

	React.useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem("userData"));
		//check to determine if token exists and is valid if it does exists
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(storedData.userId, storedData.token);
		}
	}, [login]);

	React.useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	return { token, login, logout, userId };
}

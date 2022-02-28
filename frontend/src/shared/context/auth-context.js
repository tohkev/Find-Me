import { createContext } from "react";

//context allows the sharing of data across multiple components
export const AuthContext = createContext({
	isLoggedIn: false,
	login: () => {},
	logout: () => {},
});

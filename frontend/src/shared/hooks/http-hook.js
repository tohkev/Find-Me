import React from "React";

export function useHttpClient() {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState();

	const activeHttpRequests = React.useRef([]);

	const sendRequest = React.useCallback(async function (
		url,
		method = "GET",
		body = null,
		headers = {}
	) {
		setIsLoading(true);
		//before a request is put in, we will keep track of each request and have an abort controller
		const httpAbortCtrl = new AbortController();
		activeHttpRequests.current.push(httpAbortCtrl);
		try {
			const response = await fetch(url, {
				method: method,
				headers: headers,
				body: body,
				//creates the link to the abortion request
				signal: httpAbortCtrl.signal,
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			return responseData;
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
	},
	[]);

	function clearError() {
		setError(null);
	}

	React.useEffect(() => {
		//when a component is unmounted, this will abort all pending requests as they no longer apply
		return () => {
			activeHttpRequests.current.forEach((abortCtrl) =>
				abortCtrl.abort()
			);
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
}

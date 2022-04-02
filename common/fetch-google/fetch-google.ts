export const fetchGoogle = async (
	endpoint: string,
	authToken: string,
	init?: RequestInit
) => {
	const response = await fetch(`https://www.googleapis.com${endpoint}`, {
		...init,
		headers: {
			Authorization: authToken,
			...init?.headers
		}
	});

	const data = await response.json();
	return data;
};

export const customFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = `https://event-service.dev.localhost/api/v1/${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        // credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`API call failed: ${response.status} - ${errorMessage}`);
    }

    return response.json();
};

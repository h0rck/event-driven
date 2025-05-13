export const customFetch = async (endpoint: string, options: RequestInit = {}) => {
    let url = `https://event-service.dev.localhost/api/v1/${endpoint}`;

    if (endpoint === 'events/payment') {
        url = "https://payments-service.dev.localhost/api/v1/payment"
    }

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


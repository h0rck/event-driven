export async function connectWithRetry<T>(
    connectFn: () => Promise<T>,
    serviceName: string,
    retries = 5,
    delay = 5000
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await connectFn();
        } catch (error) {
            if (i === retries - 1) throw error;
            
            console.log(`Failed to connect to ${serviceName}. Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error(`Failed to connect to ${serviceName} after ${retries} attempts`);
}
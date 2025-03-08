const messages: Array<{ exchange: string, routingKey: string, message: any }> = [];

export const RabbitMQService = {
    initialize: jest.fn().mockResolvedValue(undefined),

    publishMessage: jest.fn().mockImplementation((exchange, routingKey, message) => {
        messages.push({ exchange, routingKey, message });
        return Promise.resolve();
    }),

    getPublishedMessages: jest.fn().mockImplementation(() => {
        return [...messages];
    }),

    clearMessages: jest.fn().mockImplementation(() => {
        messages.length = 0;
    })
};

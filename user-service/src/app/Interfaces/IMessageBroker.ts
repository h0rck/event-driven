export interface IMessageBroker {
    initialize(): Promise<void>;
    publishMessage(exchange: string, routingKey: string, message: any): Promise<void>;
    closeConnection(): Promise<void>;
}

declare module 'amqplib' {
    interface Connection {
        createChannel(): Promise<Channel>;
        close(): Promise<void>;
    }

    interface Channel {
        assertExchange(exchange: string, type: string, options?: any): Promise<void>;
        publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean;
        close(): Promise<void>;
    }

    export function connect(url: string): Promise<Connection>;
}

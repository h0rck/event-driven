import * as amqp from 'amqplib';
import { connectWithRetry } from '../utils/connectionRetry.js';

interface RabbitConnection {
    createChannel(): Promise<amqp.Channel>;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'close', listener: () => void): this;
    close(): Promise<void>;
}

export class RabbitMQClient {
    private connection: RabbitConnection | null = null;
    private channel: amqp.Channel | null = null;

    async connect(url: string = 'amqp://guest:guest@localhost:5673'): Promise<void> {
        try {
            if (!this.connection) {
                const conn = await connectWithRetry(
                    async () => {
                        const connection = await amqp.connect(url);
                        return connection as unknown as RabbitConnection;
                    },
                    'RabbitMQ'
                );
                this.connection = conn;

                this.connection.on('error', (error: Error) => {
                    console.error('RabbitMQ connection error:', error);
                    this.reconnect(url).catch(err => {
                        console.error('Reconnection failed:', err);
                    });
                });

                this.connection.on('close', () => {
                    console.error('RabbitMQ connection closed');
                    this.reconnect(url).catch(err => {
                        console.error('Reconnection failed:', err);
                    });
                });
            }

            if (!this.channel && this.connection) {
                this.channel = await this.connection.createChannel();
                await this.channel.assertExchange('user-events', 'topic', {
                    durable: true
                });

                console.log('Successfully connected to RabbitMQ');
            }
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    private async reconnect(url: string): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            await this.connect(url);
        } catch (error) {
            console.error('Failed to reconnect to RabbitMQ:', error);
            setTimeout(() => this.reconnect(url), 5000);
        }
    }

    async publishUserEvent(routingKey: string, data: unknown): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            const message = Buffer.from(JSON.stringify(data));
            await this.channel.publish('user-events', routingKey, message, {
                persistent: true,
                contentType: 'application/json'
            });
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
        } catch (error) {
            console.error('Error closing RabbitMQ connections:', error);
            throw error;
        }
    }
}
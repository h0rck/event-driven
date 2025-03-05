import * as amqp from 'amqplib/callback_api';
import { promisify } from 'util';

export class RabbitMQClient {
    private connection: any;
    private channel: any;

    async connect(url: string = 'amqp://guest:guest@localhost:5672'): Promise<void> {
        try {
            // Create a new Promise for connection
            this.connection = await new Promise((resolve, reject) => {
                amqp.connect(url, (err: Error, connection: any) => {
                    if (err) reject(err);
                    resolve(connection);
                });
            });

            // Create channel
            this.channel = await new Promise((resolve, reject) => {
                this.connection.createChannel((err: Error, channel: any) => {
                    if (err) reject(err);
                    resolve(channel);
                });
            });

            // Setup exchange
            await new Promise((resolve, reject) => {
                this.channel.assertExchange('user-events', 'topic', { durable: true }, 
                    (err: Error, ok: any) => {
                        if (err) reject(err);
                        resolve(ok);
                    });
            });

            console.log('Successfully connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async publishUserEvent(routingKey: string, data: unknown): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            const message = Buffer.from(JSON.stringify(data));
            this.channel.publish('user-events', routingKey, message, {
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
                await new Promise((resolve, reject) => {
                    this.channel.close((err: Error) => {
                        if (err) reject(err);
                        resolve(true);
                    });
                });
            }
            if (this.connection) {
                await new Promise((resolve, reject) => {
                    this.connection.close((err: Error) => {
                        if (err) reject(err);
                        resolve(true);
                    });
                });
            }
        } catch (error) {
            console.error('Error closing RabbitMQ connections:', error);
            throw error;
        }
    }
}
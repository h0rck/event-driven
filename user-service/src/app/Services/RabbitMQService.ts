import amqp, { Connection, Channel } from 'amqplib';
import { IMessageBroker } from '../Interfaces/IMessageBroker';

export class RabbitMQService implements IMessageBroker {
    private connection?: Connection;
    private channel?: Channel;
    private isTestEnvironment: boolean;
    private messageLog: Array<{ exchange: string; routingKey: string; message: any }>;

    constructor() {
        this.isTestEnvironment = process.env.NODE_ENV === 'test';
        this.messageLog = [];
    }

    async initialize(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            const rabbitUri = process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672';
            this.connection = await amqp.connect(rabbitUri);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('user.events', 'direct', { durable: true });
            console.log('RabbitMQ connection established');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog.push({ exchange, routingKey, message });
            return;
        }

        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            const payload = Buffer.from(JSON.stringify(message));
            this.channel.publish(exchange, routingKey, payload, { persistent: true });
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async closeConnection(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }

    // Test helpers
    getPublishedMessages() {
        return this.messageLog;
    }

    clearMessages() {
        this.messageLog = [];
    }
}

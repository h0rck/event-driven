import amqp, { Channel, Connection } from 'amqplib';

export class RabbitMQService {
    private static connection: Connection;
    private static channel: Channel;
    private static isTestEnvironment: boolean = process.env.NODE_ENV === 'test';
    private static messageLog: Array<{ exchange: string; routingKey: string; message: any }> = [];

    static async initialize(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672');
            this.channel = await this.connection.createChannel();

            // Declarar as exchanges
            await this.channel.assertExchange('user.events', 'direct', { durable: true });

            console.log('RabbitMQ conectado com sucesso');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }

    static async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog.push({ exchange, routingKey, message });
            return;
        }

        try {
            if (!this.channel) {
                throw new Error('Canal RabbitMQ não inicializado');
            }

            await this.channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );
        } catch (error) {
            console.error('Erro ao publicar mensagem:', error);
            throw error;
        }
    }

    static async closeConnection(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            console.error('Erro ao fechar conexão com RabbitMQ:', error);
        }
    }

    // Métodos auxiliares para testes
    static getPublishedMessages() {
        return this.messageLog;
    }

    static clearMessages() {
        this.messageLog = [];
    }
}

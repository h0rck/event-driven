import amqp, { Channel, Connection } from 'amqplib';

export class RabbitMQService {
    private static connection: Connection;
    private static channel: Channel;

    static async initialize(): Promise<void> {
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
        try {
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
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            console.error('Erro ao fechar conexão com RabbitMQ:', error);
        }
    }
}

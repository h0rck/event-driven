import amqp, { Connection, Channel } from 'amqplib';
import { IMessageBroker } from '../Interfaces/IMessageBroker';

export class RabbitMQService implements IMessageBroker {
    private connection?: Connection; // Connection com RabbitMQ
    private channel?: Channel; // Canal para enviar mensagens
    private isTestEnvironment: boolean;
    private messageLog: Array<{ exchange: string; routingKey: string; message: any }>;

    constructor() {
        // Verifica se o ambiente é de teste
        this.isTestEnvironment = process.env.NODE_ENV === 'test';
        this.messageLog = [];
    }

    // Inicializa a conexão com RabbitMQ
    async initialize(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            const rabbitUri = process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672';

            // Conectando ao RabbitMQ
            this.connection = await amqp.connect(rabbitUri);

            if (this.connection) {
                // Criando um canal de comunicação com o RabbitMQ
                this.channel = await this.connection.createChannel();

                if (!this.channel) {
                    throw new Error('Falha ao criar o canal RabbitMQ');
                }

                // Assegura a existência do exchange
                await this.channel.assertExchange('user.events', 'direct', { durable: true });

                console.log('Conexão com RabbitMQ estabelecida');
            } else {
                throw new Error('Falha na conexão com RabbitMQ');
            }
        } catch (error) {
            console.error('Erro ao conectar com RabbitMQ:', error);
            throw error;
        }
    }

    // Publica uma mensagem no RabbitMQ
    async publishMessage(exchange: string, routingKey: string, message: any): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog.push({ exchange, routingKey, message });
            return;
        }

        if (!this.channel) {
            throw new Error('Canal RabbitMQ não inicializado');
        }

        try {
            // Convertendo a mensagem para Buffer (formato esperado pelo RabbitMQ)
            const payload = Buffer.from(JSON.stringify(message));

            // Publicando a mensagem no RabbitMQ
            this.channel.publish(exchange, routingKey, payload, { persistent: true });
        } catch (error) {
            console.error('Erro ao publicar a mensagem:', error);
            throw error;
        }
    }

    // Fecha a conexão com o RabbitMQ
    async closeConnection(): Promise<void> {
        if (this.isTestEnvironment) {
            this.messageLog = [];
            return;
        }

        try {
            if (this.channel) {
                await this.channel.close(); // Fechando o canal
            }

            if (this.connection) {
                await this.connection.close(); // Fechando a conexão
            }
        } catch (error) {
            console.error('Erro ao fechar a conexão RabbitMQ:', error);
        }
    }

    // Métodos auxiliares para testes
    getPublishedMessages() {
        return this.messageLog;
    }

    clearMessages() {
        this.messageLog = [];
    }
}

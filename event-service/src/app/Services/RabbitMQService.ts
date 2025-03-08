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
            // @ts-ignore
            this.connection = await amqp.connect(rabbitUri);

            if (this.connection) {
                // Criando um canal de comunicação com o RabbitMQ
                // @ts-ignore
                this.channel = await this.connection.createChannel();

                if (!this.channel) {
                    throw new Error('Falha ao criar o canal RabbitMQ');
                }

                // Assegura a existência do exchange
                await this.channel.assertExchange('user.events', 'direct', { durable: true });

                // Configurar exchanges e filas
                const configs = [
                    { exchange: 'events.email', queue: 'email_queue' },
                    { exchange: 'events.payments', queue: 'payment_queue' },
                    { exchange: 'events.inventory', queue: 'inventory_queue' }
                ];

                for (const config of configs) {
                    // Criar exchange
                    await this.channel.assertExchange(config.exchange, 'topic', { durable: true });

                    // Criar fila
                    await this.channel.assertQueue(config.queue, { durable: true });

                    // Criar binding entre exchange e fila
                    await this.channel.bindQueue(config.queue, config.exchange, '#');

                    console.log(`Setup completo para ${config.exchange} -> ${config.queue}`);
                }

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
            console.log(`Mensagem publicada no RabbitMQ: ${exchange} - ${routingKey}`);
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
                // @ts-ignore
                await this.connection.close(); // Fechando a conexão
            }

            console.log('Canal RabbitMQ fechado');
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

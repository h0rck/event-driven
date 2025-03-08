import amqp, { Channel, Connection } from 'amqplib';
import { EmailNotification } from '../interfaces/EmailNotification';

export class EmailConsumerService {
    private connection?: Connection;
    private channel?: Channel;

    async initialize(): Promise<void> {
        try {
            const rabbitUri = process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672';
            // @ts-ignore
            this.connection = await amqp.connect(rabbitUri);
            // @ts-ignore
            this.channel = await this.connection.createChannel();

            // @ts-ignore
            await this.channel.assertExchange('user.events', 'direct', { durable: true });
            // @ts-ignore
            const { queue } = await this.channel.assertQueue('email_queue', { durable: true });

            // @ts-ignore
            await this.channel.bindQueue(queue, 'user.events', 'user.email.confirmation');
            // @ts-ignore
            await this.channel.prefetch(1);

            console.log('Consumidor iniciado, aguardando mensagens...');
            // @ts-ignore
            await this.channel.consume(queue, async (msg) => {
                if (msg) {
                    try {
                        const notification: EmailNotification = JSON.parse(msg.content.toString());
                        console.log('Email recebido para:', notification.to);
                        console.log('Dados:', notification);

                        // Aqui você implementaria o envio real do email
                        await this.processEmail(notification);

                        this.channel?.ack(msg);
                    } catch (error) {
                        console.error('Erro ao processar mensagem:', error);
                        this.channel?.nack(msg, false, true);
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao iniciar consumidor:', error);
            throw error;
        }
    }

    private async processEmail(notification: EmailNotification): Promise<void> {
        // Simula o envio do email (implementar com nodemailer depois)
        console.log('Simulando envio de email:');
        console.log('Para:', notification.to);
        console.log('Assunto:', notification.subject);
        console.log('Template:', notification.template);
        console.log('Dados:', notification.data);
    }

    async closeConnection(): Promise<void> {
        await this.channel?.close();
        // @ts-ignore
        await this.connection?.close();
    }
}
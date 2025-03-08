import 'dotenv/config';
import { EmailConsumerService } from './services/EmailConsumerService';

async function bootstrap() {
    const emailConsumer = new EmailConsumerService();

    try {
        await emailConsumer.initialize();
        console.log('Serviço de email iniciado com sucesso');

        process.on('SIGINT', async () => {
            await emailConsumer.closeConnection();
            process.exit(0);
        });
    } catch (error) {
        console.error('Falha ao iniciar serviço de email:', error);
        process.exit(1);
    }
}

bootstrap();
import Fastify, { FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { userRoutes } from './api/routes/userRoutes';
import { RabbitMQClient } from './infrastructure/messaging/rabbitmq';

const fastify = Fastify({
    logger: true
} as FastifyServerOptions);

// Registrar o plugin JWT
fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
});

// Declare module para TypeScript reconhecer o jwt
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            userId: string;
            email: string;
        }
    }
}

async function start() {
    try {
        const messagingClient = new RabbitMQClient();
        await messagingClient.connect(process.env.RABBITMQ_URI);

        await fastify.register(cors, {
            origin: true
        });

        await fastify.register(userRoutes);

        process.on('SIGTERM', async () => {
            await messagingClient.close();
            await fastify.close();
            process.exit(0);
        });

        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({
            port,
            host: '0.0.0.0'
        });

        console.log(`Server is running on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
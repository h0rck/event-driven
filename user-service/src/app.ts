import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { RabbitMQClient } from './infrastructure/messaging/rabbitmq';
import { userRoutes } from './api/routes/userRoutes';

async function buildApp(): Promise<FastifyInstance> {
    const fastify = Fastify({
        logger: true
    });

    // Register JWT
    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'your-secret-key'
    });

    // Register Swagger
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'User Service API',
                description: 'User service documentation',
                version: '1.0.0'
            },
            servers: [{
                url: 'https://user-service.dev.localhost'
            }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        staticCSP: true
    });

    // Register CORS
    await fastify.register(cors, {
        origin: true
    });

    // Register Routes
    await fastify.register(userRoutes);

    return fastify;
}

// Declare module para TypeScript reconhecer o jwt
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            userId: string;
            email: string;
        }
    }
}

// Start the server
async function start() {
    try {
        const app = await buildApp();
        const messagingClient = new RabbitMQClient();
        await messagingClient.connect(process.env.RABBITMQ_URI);

        process.on('SIGTERM', async () => {
            await messagingClient.close();
            await app.close();
            process.exit(0);
        });

        const port = Number(process.env.PORT) || 3000;
        await app.listen({
            port,
            host: '0.0.0.0'
        });

        console.log(`Server is running on port ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
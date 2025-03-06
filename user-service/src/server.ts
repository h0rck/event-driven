import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

async function buildApp() {
    const app = fastify();

    // Registrar Swagger
    await app.register(swagger, {
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

    // Registrar Swagger UI
    await app.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        staticCSP: true
    });

    return app;
}

// Iniciar o servidor
async function start() {
    try {
        const app = await buildApp();
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running at http://localhost:3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();

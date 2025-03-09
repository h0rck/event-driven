import { createServer } from 'http';
import { Server } from 'socket.io';
import { RabbitMQService } from './services/rabbitmq.service';

const port = process.env.PORT || 3002;
const httpServer = createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }
    res.writeHead(404);
    res.end();
});

const io = new Server(httpServer, {
    cors: {
        origin: [
            "https://monitor.dev.localhost",
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['polling', 'websocket'],
    path: '/socket.io'
});

const rabbitMQ = new RabbitMQService();

io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);


    const queues = await rabbitMQ.getQueues();
    socket.emit('queues', queues);


    // Que os deuses da programação me perdoem por esse setInterval em um socket 
    // Coloquei 5000 porque é o tempo que o rabbitMQ atualiza as informações
    const pollingInterval = setInterval(async () => {
        const updatedQueues = await rabbitMQ.getQueues();
        socket.emit('queues', updatedQueues);
    }, 5000);

    socket.on('getQueueInfo', async (queueName: string) => {
        const queueInfo = await rabbitMQ.getQueueInfo(queueName);
        socket.emit('queueInfo', queueInfo);
    });

    socket.on('subscribeToQueue', (queueName: string) => {
        rabbitMQ.subscribeToQueue(queueName, (message) => {
            socket.emit('queueMessage', message);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(pollingInterval); // Clean up the interval when client disconnects
    });
});

httpServer.listen(port, () => {
    console.log(`Monitor service listening on port ${port}`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

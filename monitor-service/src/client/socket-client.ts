// Exemplo para o servidor (backend)
import { Server } from 'socket.io';

const io = new Server(3001, {
    cors: {
        origin: '*', // Pode configurar isso para um domínio específico
    },
});

// Evento de conexão
io.on('connection', (socket) => {
    console.log('A client connected', socket.id);

    // Enviar a lista de filas (simulação)
    socket.emit('queues', ['queue1', 'queue2', 'queue3']);

    // Evento para solicitar informações de uma fila
    socket.on('getQueueInfo', (queueName) => {
        console.log(`Requesting info for ${queueName}`);
        // Simulação de dados
        socket.emit('queueInfo', { queueName, info: 'Detalhes da fila' });
    });

    // Evento para se inscrever em uma fila
    socket.on('subscribeToQueue', (queueName) => {
        console.log(`Subscribed to ${queueName}`);
        socket.join(queueName); // Se inscreve na "sala" da fila
    });

    // Emissor de mensagens para a fila
    socket.on('queueMessage', (message) => {
        console.log('Message received:', message);
        socket.emit('queueMessage', { message });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

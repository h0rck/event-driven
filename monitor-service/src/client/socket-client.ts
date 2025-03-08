import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to WebSocket');
});

socket.on('queues', (queues) => {
    console.log('Received queues:', queues);
});

socket.on('queueInfo', (queueInfo) => {
    console.log('Received queue info:', queueInfo);
});

socket.on('queueMessage', (message) => {
    console.log('Received message:', message);
});

// Para solicitar informações de uma fila específica
socket.emit('getQueueInfo', 'nome-da-fila');

// Para se inscrever em uma fila específica
socket.emit('subscribeToQueue', 'nome-da-fila');

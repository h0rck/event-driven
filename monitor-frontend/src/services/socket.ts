import { io, Socket } from 'socket.io-client';

let socket: Socket;

interface QueueInfo {
    name: string;
    messages: number;
    consumers: number;
    state: 'running' | 'stopped';
}

interface SocketError extends Error {
    message: string;
    data?: any;
}

export const connectSocket = () => {
    socket = io('https://monitor-service.dev.localhost', {
        transports: ['polling', 'websocket'],
        path: '/socket.io',
        rejectUnauthorized: false,
        secure: true,
        withCredentials: true
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('connect_error', (error: SocketError) => {
        console.error('Socket connection error:', error);
        window.dispatchEvent(new CustomEvent('socket:error', { detail: error }));
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('Disconnected from socket');
    }
};

export const listenForMessages = (callback: (message: any) => void) => {
    if (socket) {
        socket.on('message', callback);
    }
};

export const sendMessage = (event: string, data: any) => {
    if (socket) {
        socket.emit(event, data);
    }
};

export const listenForUpdates = (callback: (data: any) => void) => {
    if (!socket) {
        connectSocket();
    }
    socket.on('monitor-update', callback);
};

export const listenForNotifications = (callback: (data: any) => void) => {
    if (!socket) {
        connectSocket();
    }
    socket.on('notification', callback);
};

export const getQueues = (callback: (queues: QueueInfo[]) => void) => {
    if (!socket) {
        connectSocket();
    }
    socket.on('queues', callback);
};

export const getQueueInfo = (queueName: string, callback: (queueInfo: QueueInfo) => void) => {
    if (!socket) {
        connectSocket();
    }
    socket.emit('getQueueInfo', queueName);
    socket.on('queueInfo', callback);
};

export const subscribeToQueue = (queueName: string, callback: (message: any) => void) => {
    if (!socket) {
        connectSocket();
    }
    socket.emit('subscribeToQueue', queueName);
    socket.on('queueMessage', callback);
};

export const unsubscribeFromQueue = (queueName: string) => {
    if (socket) {
        socket.off('queueMessage');
    }
};

// Cleanup function to remove all listeners
export const cleanup = () => {
    if (socket) {
        socket.off('queues');
        socket.off('queueInfo');
        socket.off('queueMessage');
        disconnectSocket();
    }
};
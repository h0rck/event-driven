import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const connectSocket = () => {
    socket = io('https://monitor-service.dev.localhost', {
        transports: ['polling', 'websocket'], // Permite fallback para polling (HTTP)
        path: '/socket.io',
        rejectUnauthorized: false,
        secure: true,
        withCredentials: true
    });


    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
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
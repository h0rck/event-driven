import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const connectSocket = () => {
    socket = io('http://localhost:3002');
    console.log('Connected to socket');
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
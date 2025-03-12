import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socket: any;

export const connectSocket = (userId: number) => {
    socket = io(SOCKET_URL, {
        auth: {
            userId
        }
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const getSocket = () => socket; 
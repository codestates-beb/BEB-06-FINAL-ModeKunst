import { io } from "socket.io-client";

export let socket = io("http://localhost:8000", { transports: ["websocket"] });
export const initSocketConnection = () => {
    if (socket) return;
    socket.connect();
};

export const disconnectSocket = () => {
    if (socket == null || socket.connected === false) {
        return;
    }
    socket.disconnect();
    socket = undefined;
};
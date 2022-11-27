import io from "socket.io-client";

let socket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );

export const initSocketConnection = (socket) => {
    if (!socket){
        socket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );
        return socket;
    }else{
        return socket;
    }
};

export const disconnectSocket = () => {
    if (socket == null || socket.connected === false) {
        return;
    }
    socket.disconnect();
    socket = undefined;
};
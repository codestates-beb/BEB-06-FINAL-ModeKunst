import io from "socket.io-client";

export let initSocket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );

export const initSocketConnection = (socket, nickname) => {
    if (!socket){
        console.log(2);
        socket = initSocket;
        socket.emit('login', { nickname: nickname });
        return socket;
    }else{
        console.log(1);
        socket.emit('login', { nickname: nickname });
        return socket;
    }
};

export const disconnectSocket = (socket, nickname) => {
    socket.emit('logout', { nickname: nickname });
};
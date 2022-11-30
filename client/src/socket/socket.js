import io from "socket.io-client";

export let initSocket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );

export const initSocketConnection = (socket, nickname) => {
    console.log(socket);
    if (!socket){
        socket = initSocket;
        console.log(1);
        socket.emit('login', { nickname: nickname });
        return socket;
    }else{
        console.log(2);
        socket.emit('login', { nickname: nickname });
        return socket;
    }
};

export const disconnectSocket = (socket, nickname) => {
    console.log(3)
    socket.emit('logout', { nickname: nickname });
};
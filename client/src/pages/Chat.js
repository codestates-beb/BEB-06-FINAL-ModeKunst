import React, {useEffect, useState} from 'react';
import axios from "axios";
import {initSocketConnection, disconnectSocket } from '../socket/socket'
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";



function Chat(props) {

    let socket;

    const location = useLocation();
    const DMReceiver = location.state;

    const userInfo = useSelector(state => state.user);
    const { nickname } = userInfo.userInfo

    const [ chatRooms, setChatRooms ] = useState();
    const [ joinRoom, setJoinRoom ] = useState('');
    const [ receiver, setReceiver ] = useState('');
    const [ chatData, setChatData ] = useState();
    const [ message, setMessage ] = useState('');



    useEffect(() => {
        socket = initSocketConnection(socket);

        return () => {
            disconnectSocket();
        }
    }, []);

    useEffect(() => {
        console.log(socket)
        socket.on('test', (data) => {
            console.log(data);
        })
    }, [initSocketConnection]);


    return (
        <div>

        </div>
    );
}

export { Chat };
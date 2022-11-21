import React, {useEffect, useState} from 'react';
import chat from './chat.css';
import axios from "axios";
import io from 'socket.io-client';
import { socket, initSocketConnection, disconnectSocket } from '../socket/socket'
import {useSelector} from "react-redux";



function Chat(props) {

    const socket = io('http://localhost:8000',{
        cors: {
            origin: '*'
        }
    });

    const userInfo = useSelector(state => state.user);
    const { nickname } = userInfo.userInfo
    const [ chatRooms, setChatRooms ] = useState();
    const [ joinRoom, setJoinRoom ] = useState('');
    const [ receiver, setReceiver ] = useState('');
    const [ chatData, setChatData ] = useState();
    const [ message, setMessage ] = useState('');

    useEffect(() => {
        socket.on('connection', socket => {
            console.log(socket);
        });

        axios.get(`http://localhost:8000/users/chatRoom/${nickname}`, {
            withCredentials: true
        })
            .then((result) =>{
                console.log(result);
                setChatRooms(result.data.data.chatRoomName);
            })
    }, []);

    socket.on('chatRoom', (data) => {
        setChatData(data);
    });

    socket.on('messages', (data) => {
        setChatData(data);
    })

    const joinChat =  (e) => {
        const id = e.target.id;
        const receiver = e.target.className;
        setJoinRoom(id);
        setReceiver(receiver);
        socket.emit('join', {
            sender: nickname,
            receiver: receiver,
            roomId: id
        });
    }

    const onChangeMessage = (e) => {
        setMessage(e.target.value);
    }

    const sendMessage = () => {
        socket.emit('send', {
            id: joinRoom,
            sender: nickname,
            receiver: receiver,
            message: message,
        })
    }

    return (
        <div>
            <div className="row">
                <div className="col-3">
                    {
                        chatRooms?.length ? chatRooms.map((a, i) => {

                            return(
                                <div>
                                    <button onClick={joinChat}>
                                        <p id={a.id} className={a.name}>{a.name}</p>
                                    </button>
                                </div>
                            )
                        }) : <div>채팅방 목록이 없습니다.</div>
                    }
                </div>

                <div className="col-9 p-0">
                    <div className="chat-room">
                        <ul className="list-group chat-content" >
                            {
                                chatData?.length ?
                                    chatData.map((a) => {
                                        return(
                                            <div>
                                                <li>sender: {a.senderNickname}</li>
                                                <li>message: {a.message}</li>
                                                <li>{a.createdAt}</li>
                                            </div>
                                        )
                                    })
                                    :
                                    <div>대화 내용이 없습니다.</div>
                            }
                        </ul>
                        <div className="input-group">
                            <input type="text" className="form-control" onChange={onChangeMessage}/>
                            <button onClick={sendMessage}>전송</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Chat };
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {initSocketConnection, disconnectSocket } from '../socket/socket'
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import io from "socket.io-client";



function Chat(props) {

    const location = useLocation();
    const DMReceiver = location.state;

    const userInfo = useSelector(state => state.user);
    const { nickname } = userInfo.userInfo

    const [ chatRooms, setChatRooms ] = useState();
    const [ joinRoom, setJoinRoom ] = useState();
    const [ receiver, setReceiver ] = useState();
    const [ chatData, setChatData ] = useState();
    const [ message, setMessage ] = useState('');

    let socket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );

    useEffect(() => {
        socket = initSocketConnection(socket);
        return () => {
            //socket.emit('leave', joinRoom);
            disconnectSocket();
        }
    }, [socket]);

    useEffect(() => {
        socket.emit('findRooms', nickname);

        socket.on('myRooms', (rooms) => {
            setChatRooms(rooms);
        })
    }, [initSocketConnection]);



    const enter = (e) => {
        const roomId = (e.target.id);
        const receiver = e.target.textContent;

        // if(roomId !== joinRoom && joinRoom){
        //     socket.emit('leave', joinRoom);
        // }

        setJoinRoom(roomId);
        setReceiver(receiver);

        if(joinRoom !== roomId){
            socket.emit('enterRooms', { roomId, nickname, receiver });
            // 채팅방 내용
            socket.on('roomData', (data) => {
                setChatData(data);
            })
        }
    }

    const writeMsg = (e) => {
        setMessage(e.target.value);
    };

    const sendMsg = () => {
        socket.emit('sendMsg', { joinRoom, message, nickname, receiver });
    }







    return (
        <div>
            <div>
                {
                    chatRooms
                        ?
                        chatRooms.map((room) => {
                            return(
                                <div key={room.id}>
                                    <span onClick={enter} id={room.id}>{room.name}</span>
                                    <img src={room.profile_img}/>
                                </div>
                            )
                        })
                        :
                        <div>채팅 목록이 없습니다.</div>
                }
            </div>
            <div>
                {
                    joinRoom
                        ?
                        <div>
                            <button>X</button>
                        </div>
                        : null
                }
                {
                    chatData
                        ? chatData.map((chat) => {
                            return(
                                <div>
                                    <p>{chat.senderNickname}</p>
                                    <p>{chat.message}</p>
                                    <p>{chat.createdAt}</p>
                                </div>
                            );
                        })
                        : <div>대화 내용이 없습니다.</div>
                }
                {
                    joinRoom
                        ?
                        <div>
                            <input onChange={writeMsg}/>
                            {
                                message
                                    ?
                                        <button onClick={sendMsg}>send</button>
                                    :
                                        null
                            }
                        </div>
                        : null
                }
            </div>
            <div>

            </div>
        </div>
    );
}

export { Chat };
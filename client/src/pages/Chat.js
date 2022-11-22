import React, {useEffect, useState} from 'react';
import chat from './chat.css';
import axios from "axios";
import io from 'socket.io-client';
import { socket, initSocketConnection, disconnectSocket } from '../socket/socket'
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";



function Chat(props) {
    const location = useLocation();


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
    const [ directReceiver, setDirectReceiver] = useState('');


    useEffect(() => {
        socket.on('connection', socket => {
            console.log(socket);
        });

        if(directReceiver){
            socket.emit('dm', {
                sender: nickname,
                receiver: directReceiver
            });
        }

        axios.get(`http://localhost:8000/users/chatRoom/${nickname}`)
            .then((result) =>{
                setDirectReceiver(location.state);
                setChatRooms(result.data.data.chatRoomName);
            })

    }, [directReceiver]);


    // 이전에 했던 대화 목록
    socket.on('chatRoom', (data) => {
        console.log(data);
        setChatData(data);
    });
    // 실시간 통신
    socket.on('messages', (data) => {
        console.log(data)
        setChatData(data);
    })

    // DM으로 방 생성 했을 떄 방 번호
    socket.on('dm', (data) => {
        let roomId
        let messages
        if(data?.messages){
            roomId = data.roomId;
            messages = data.messages;
        }else{
            roomId = data.roomId;
        }
        console.log(data)
        setReceiver(directReceiver)
        setJoinRoom(roomId);
        setChatData(messages);
    });



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
                        <div>
                            <button>나가기</button>
                        </div>
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
                                    joinRoom
                                    ?
                                        <div>{receiver}님과 대화 내용이 없습니다.</div>
                                    :
                                        <div>채팅을 시작해 보세요!</div>
                            }
                        </ul>
                        {
                            joinRoom
                            ?
                                <div className="input-group">
                                    <input type="text" className="form-control" onChange={onChangeMessage}/>
                                    <button onClick={sendMessage}>전송</button>
                                </div>
                            :
                                null
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export { Chat };
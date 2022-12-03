import React, { useEffect, useState } from "react";
import axios from "axios";
import { initSocket, initSocketConnection } from "../socket/socket";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function Chat(props) {
  const location = useLocation();
  let DMReceiver = location.state;

  const userInfo = useSelector(state => state.user);
  const { nickname } = userInfo.userInfo;

  // chatRooms -> 내가 들어가있는 채팅방 목록들
  const [chatRooms, setChatRooms] = useState([]);
  const [joinRoom, setJoinRoom] = useState();
  const [receiver, setReceiver] = useState();
  const [chatData, setChatData] = useState("");
  const [message, setMessage] = useState("");
  // 실시간 메시지 담는 box
  const [box, setBox] = useState("");
  // 실시간 방 담는 box
  const [box2, setBox2] = useState("");

  //let socket = io( 'http://localhost:8000',{ cors: { origin: '*' } } );
  let socket = initSocket;
  useEffect(() => {
    initSocketConnection(socket, nickname);
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/chatRoom/${nickname}`)
      .then(result => {
        const { chatRoomName } = result.data.data;
        console.log(chatRoomName);
        if (Array.isArray(chatRoomName)) {
          setChatRooms(chatRoomName);
        }
      });
  }, [chatData, box2]);

  useEffect(() => {
    if (DMReceiver) {
      socket.emit("createOrEnter", { sender: nickname, receiver: DMReceiver });

      setReceiver(DMReceiver);
      DMReceiver = false;
    }
  }, [DMReceiver]);

  socket.on("updateRooms", data => {
    console.log(data);
    const { id, name, sender } = data;
    if (name === nickname) {
      setReceiver(sender);
    } else {
      setReceiver(name);
    }
    setJoinRoom(id);

    setBox2(data);
  });

  useEffect(() => {
    if (box2) {
      setChatRooms(prevState => {
        console.log(prevState);
        if (prevState) {
          return [...prevState, box2];
        } else {
          return [box2];
        }
      });
    }
  }, [setChatRooms]);

  socket.on("roomData", data => {
    if (data?.room) {
      setJoinRoom(data.room);
      setChatData(data.messages);
    } else {
      console.log(data);
      setChatData(data);
    }
  });

  const enter = e => {
    const roomId = e.target.id;
    const receiver = e.target.textContent;

    setJoinRoom(roomId);
    setReceiver(receiver);

    if (joinRoom !== roomId) {
      // 채팅방 내용
      socket.emit("enterRooms", { roomId, nickname, receiver });
    }
  };

  const writeMsg = e => {
    setMessage(e.target.value);
  };

  const sendMsg = () => {
    console.log(receiver);
    socket.emit("sendMsg", { joinRoom, message, nickname, receiver });
  };

  socket.on("updateChatData", data => {
    console.log(data);
    setBox(data);
  });

  useEffect(() => {
    if (box) {
      setChatData(prevState => {
        console.log(prevState);
        if (prevState) {
          console.log(1);
          return [...prevState, box];
        } else {
          console.log(2);
          return [box];
        }
      });
    }
  }, [box]);

  const leaveRoom = () => {
    setJoinRoom("");
    setChatData();
    socket.emit("leave", { joinRoom, nickname, receiver });
  };
  if (chatRooms) {
    console.log(chatRooms);
    console.log(1);
    console.log(chatRooms[0]);
  } else {
    console.log(2);
  }

  socket.on("deleteRoom", data => {
    console.log(data);
    setChatRooms(data);
  });

  return (
    <div className="my-48">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>10</div>
      <div>11</div>
      <div>12</div>
      <div>13</div>
      <div>14</div>
      <div>
        {chatRooms ? (
          chatRooms[0] ? (
            // 채팅방 목록 여러 칸들(좌측에 뜰)
            chatRooms.map((room, i) => {
              return (
                <div
                  key={i}
                  className="px-4 py-2 flex w-1/2 border-2 border-black bg-red-500"
                >
                  <img
                    src={room.profile_img}
                    className="w-10 h-10 object-cover bg-slate-200 shadow-lg rounded-full"
                  />
                  <span onClick={enter} id={room.id}>
                    {room.name}
                  </span>
                  {room.lastChat ? (
                    <span>마지막 채팅: {room.lastChat}</span>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div>채팅 목록이 없습니다.</div>
          )
        ) : (
          <div>채팅 목록이 없습니다.</div>
        )}
      </div>
      <div>
        {joinRoom ? (
          chatData.length ? (
            <div>
              {joinRoom ? (
                chatData.length ? (
                  <div>
                    <div>
                      <button onClick={leaveRoom}>X</button>
                    </div>
                    {chatData.map((chat, i) => {
                      return (
                        <div key={i}>
                          <p>{chat.senderNickname}</p>
                          <p>{chat.message}</p>
                          <p>{chat.createdAt}</p>
                        </div>
                      );
                    })}
                    <div>
                      <input onChange={writeMsg} />
                      {message ? <button onClick={sendMsg}>send</button> : null}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <button onClick={leaveRoom}>X</button>
                    </div>
                    <div>대화 내용이 없습니다.</div>
                    <div>
                      <input onChange={writeMsg} />
                      {message ? <button onClick={sendMsg}>send</button> : null}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          ) : (
            <div>
              <div>
                <button onClick={leaveRoom}>X</button>
              </div>
              <div>대화 내용이 없습니다.</div>
              <div>
                <input onChange={writeMsg} />
                {message ? <button onClick={sendMsg}>send</button> : null}
              </div>
            </div>
          )
        ) : null}
      </div>
      <div></div>
    </div>
  );
}

export { Chat };

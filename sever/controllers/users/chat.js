const { Chat, Message, User } = require('../../models');
const { Op, literal, fn} = require('sequelize');
const { Server } = require('socket.io');
const cors = require("cors");
let io;
let server;
function getSocket(http){
    io = new Server(http,{
        cors: {
            origin: "http://localhost:3000",
            methods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
            credentials: true,
        }
    });
    io.on('connection', function(socket){
        console.log(test);
    })
}

module.exports = {

    find: async (req, res) => {
        const sender = req.params.nickname;

        if(sender){

            let chatRoom = await Chat.findAll({
                where: {
                    [Op.or] : [{[Op.and]: [{senderNickname: sender }, { status: { [Op.not] : sender } } ] }, {[Op.and]: [{receiverNickname: sender}, {status: {[Op.not]: sender}}]}]
                },
                include: [ { model: User, attributes: ['profile_img'], as: 'Receiver' }, { model: User, attributes: ['profile_img'], as: 'Sender' } ],
                attributes: ['id', 'lastChat', 'lastChatDate', 'senderNickname', 'receiverNickname'],
                raw: true
            });

            console.log(chatRoom);
            const chatRoomName = chatRoom.map((a) => {
                let profile_img;
                if(sender === a.senderNickname){
                    profile_img = a['Receiver.profile_img'];
                    return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                }else if(sender === a.receiverNickname){
                    profile_img = a['Sender.profile_img'];
                    return { id: a.id, name: a.senderNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                }
            });
            console.log(chatRoomName)
            res.status(200).json({
                message: `${sender}님의 채팅방 목록`,
                data: {
                    chatRoomName
                }
            });

        }else{
            res.status(401).json({
                message: '로그인 이후 이용해주세요.'
            })
        }
    },
}
const { Chat, Message, User } = require('../../models');
const { Op } = require('sequelize');
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

    socketIO:  (http) => {
        // io = new Server(http);
        getSocket(http);
        server = http;
    },

    create: async (req, res) => {
        console.log(server)
        const sender = req.session.user?.nickname;
        const { receiver } = req.params;
        console.log(`입력 받은 sender: ${sender}, receiver: ${receiver}`);
        if(sender){
            const hasChat = await Chat.findOne({
                where: {
                    [Op.or] : [ {[Op.and]: [ {senderNickname: sender}, { receiverNickname: receiver} ]}, {[Op.and]: [ {senderNickname: receiver}, { receiverNickname: sender} ]} ]
                },
                raw: true
            })

            if(!hasChat){
                try{
                    const chatRoom = await Chat.create({
                        senderNickname: sender,
                        receiverNickname: receiver,
                    });
                    console.log(chatRoom.dataValues.id);

                    res.status(200).json({
                        message: '채팅방이 개설 되었습니다.'
                    })
                } catch (e) {
                    console.log(e);
                }

            } else {
                const receiverNickname = senderHasChat.receiverNickname
                const chatRoom = senderHasChat.id;

                const messages = await Message.findAll({
                    where: { ChatId: chatRoom },
                    attributes: ['message', 'createdAt', 'senderNickname'],
                    raw: true
                });

                res.status(200).json({
                    message: '채팅방이 이미 존재합니다.',
                    data: {
                        receiverNickname,
                        messages
                    }
                })
            }
        }else{
            res.status(401).json({
                message: '로그인 이후 사용 가능합니다.'
            })
        }
    },

    find: async (req, res) => {
        const sender = req.params.nickname;

        if(sender){

            let chatRoom = await Chat.findAll({
                where: {
                    [Op.or] : [ {senderNickname: sender}, {receiverNickname: sender} ]
                },
                include: [ { model: User, attributes: ['profile_img'], as: 'Receiver' }, { model: User, attributes: ['profile_img'], as: 'Sender' }],
                raw: true
            });

            const chatRoomName = chatRoom.map((a) => {
                let profile_img;
                if(sender === a.senderNickname){
                    profile_img = a['Receiver.profile_img'];
                    return { id: a.id, name: a.receiverNickname, profile_img: profile_img }
                }else if(sender === a.receiverNickname){
                    profile_img = a['Sender.profile_img'];
                    return { id: a.id, name: a.senderNickname, profile_img: profile_img }
                }
            });

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

    join: async (req, res) => {
        const messages = await Chat.findAll({

        });
    },

    send: async (req, res) => {
        const sender = req.session.user?.nickname;

        if(sender){
            const { message, chatRoom, receiver } = req.body;
            console.log(`입력받은 chatRoom: ${chatRoom}, sender: ${sender}, receiver: ${receiver}, message: ${message}`);

            await Message.create({
                message: message,
                senderNickname: sender,
                receiverNickname: receiver,
                ChatId: chatRoom
            });

            const messages = await Message.findAll({
                where: { ChatId: chatRoom },
                attributes: ['message', 'createdAt', 'senderNickname'],
                raw: true
            });

            console.log(messages);

            res.status(200).json({
                message: `${receiver}님에게 message를 보냈습니다.`,
                data: {
                    messages
                }
            })
        }else{
            res.status(404).json({
                message: `로그인 이후 이용 가능합니다.`
            })
        }

    },

    delete: async (req, res) => {

    },
}
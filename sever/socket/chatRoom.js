const { Chat, Message } = require('../models');
const { Op } = require('sequelize');

module.exports = {

    create: async (sender, receiver) => {
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

                    console.log(`${chatRoom.dataValues.id}방이 생성 되었습니다.`);
                    return chatRoom.dataValues.id;
                } catch (e) {
                    console.log(e);
                }

            } else {
                const receiverNickname = hasChat.receiverNickname
                const chatRoom = hasChat.id;

                const messages = await Message.findAll({
                    where: { ChatId: chatRoom },
                    attributes: ['message', 'createdAt', 'senderNickname'],
                    raw: true
                });

                console.log('이미 존재하는 방 입니다.');
                return chatRoom;
            }
        }
    },

    find: async (req, res) => {
        //const sender = req.session.user?.nickname;
        const sender = req.params.nickname;
        if(sender){

            const chatRoom = await Chat.findAll({
                where: {
                    [Op.or] : [ {senderNickname: sender}, {receiverNickname: sender} ]
                },
                raw: true
            });

            const chatRoomName = chatRoom.map((a) => {
                if(sender === a.senderNickname){
                    return { id: a.id, name: a.receiverNickname }
                }else if(sender === a.receiverNickname){
                    return { id: a.id, name: a.senderNickname }
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

    join: async (id, sender, receiver) => {
        const messages = await Message.findAll({
            where: { ChatId: id },
            attributes: ['message', 'createdAt', 'senderNickname'],
            raw: true
        });
        return messages
    },

    send: async (id, sender, receiver, message) => {
        if(sender){
            console.log(`입력받은 chatRoom: ${id}, sender: ${sender}, receiver: ${receiver}, message: ${message}`);

            await Message.create({
                message: message,
                senderNickname: sender,
                receiverNickname: receiver,
                ChatId: id
            });

            return await Message.findAll({
                where: {ChatId: id},
                attributes: ['message', 'createdAt', 'senderNickname'],
                raw: true
            });
        }

    },

    delete: async (req, res) => {

    },
}
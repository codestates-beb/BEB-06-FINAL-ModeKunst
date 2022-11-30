const { Chat, Message, User} = require('../models');
const { Op, fn, col, literal} = require('sequelize');
const { many } = require('../controllers/function/createdAt');
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
                return { chatRoom, messages};
            }
        }
    },

    createOrEnter: async (sender, receiver) => {
        const hasChat = await Chat.findOne({
            where: {
                [Op.or] : [ {[Op.and]: [ {senderNickname: sender}, { receiverNickname: receiver} ]}, {[Op.and]: [ {senderNickname: receiver}, { receiverNickname: sender} ]} ]
            },
            raw: true
        });
        if(hasChat){
            const chatRoom = hasChat.id;

            const messages = await Message.findAll({
                where: { ChatId: chatRoom },
                attributes: ['message', 'createdAt', 'senderNickname'],
                raw: true
            });

            console.log('이미 존재하는 방 입니다.');
            return { chatRoom, messages};
        }else{
            if(!(sender === receiver)){
                try{
                    const chat = await Chat.create({
                        senderNickname: sender,
                        receiverNickname: receiver,
                    });
                    const { profile_img }  = await User.findOne({where: {nickname: receiver}, attributes:['profile_img']});

                    return { room : { id: chat.dataValues.id, name: receiver, profile_img: profile_img, sender: sender } };
                } catch (e) {
                    console.log(e);
                }
            }else{
                console.log('err');
            }

        }
    },

    find: async (sender) => {
        //const sender = req.session.user?.nickname;

        if(sender){

            let chatRoom = await Chat.findAll({
                where: {
                    [Op.or] : [ {senderNickname: sender}, {receiverNickname: sender} ]
                },
                include: [ { model: User, attributes: ['profile_img'], as: 'Receiver' }, { model: User, attributes: ['profile_img'], as: 'Sender' }],
                raw: true
            });
            //console.log(chatRoom);

            // let chatRoomDate = chatRoom.map((a) => {
            //     console.log(a['Messages.createdAt'])
            //     return new Date(a['Messages.createdAt'])
            // });
            //
            // chatRoomDate = many(chatRoomDate);

            // console.log(chatRoomDate);

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

            return chatRoomName

        }else{
            return('로그인 필요');
        }
    },

    join: async (id, sender, receiver) => {
        const messages = await Message.findAll({
            where: { ChatId: id,  },
            attributes: ['message', 'createdAt', 'senderNickname'],
            order: literal('createdAt ASC'),
            raw: true
        });
        return messages
    },

    send: async (id, message, sender, receiver) => {
        if(sender){
            console.log(`입력받은 chatRoom: ${id}, sender: ${sender}, receiver: ${receiver}, message: ${message}`);

            await Message.create({
                message: message,
                senderNickname: sender,
                receiverNickname: receiver,
                ChatId: id,
            });

            const msg = await Message.findOne({
                where: { ChatId: id},
                order: literal('createdAt DESC')
            });

            return { message: msg.dataValues.message, createdAt: msg.dataValues.createdAt, senderNickname: msg.dataValues.senderNickname };

        }

    },

    delete: async (req, res) => {

    },
}
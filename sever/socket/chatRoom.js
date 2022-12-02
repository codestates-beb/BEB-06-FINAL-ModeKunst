const { Chat, Message, User} = require('../models');
const { Op, fn, col, literal, where} = require('sequelize');
const { many } = require('../controllers/function/createdAt');
//[Op.not]: status
async function findMsg(roomId, status){
    return await Message.findAll({
        where: { ChatId: roomId, status: {[Op.and] : ['0', {[Op.and] : [{[Op.not]: 1}, {[Op.not]: status}]}]}},
        attributes: ['message', 'createdAt', 'senderNickname'],
        order: literal('createdAt ASC'),
        raw: true
    });
}

module.exports = {


    createOrEnter: async (sender, receiver) => {
        const hasChat = await Chat.findOne({
            where: {
                [Op.or] : [ {[Op.and]: [ {senderNickname: sender}, { receiverNickname: receiver} ]}, {[Op.and]: [ {senderNickname: receiver}, { receiverNickname: sender} ]} ]
            },
            raw: true
        });
        if(hasChat){
            const chatRoom = hasChat.id;

            await Chat.findOne({
                where: { status: sender, id: chatRoom  }
            }).then((result) => {
                if(result){
                    result.update({ status: '0' });
                }
            });

            const messages = await findMsg(chatRoom, sender);
            const { profile_img }  = await User.findOne({where: {nickname: receiver}, attributes:['profile_img']});
            console.log(chatRoom)
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
                    console.log(chat);
                    return { room : { id: chat.dataValues.id, name: receiver, profile_img: profile_img, sender: sender } };
                } catch (e) {
                    console.log(e);
                }
            }else{
                console.log('err');
            }

        }
    },

    join: async (id, sender, receiver) => {
        console.log(sender);

        const messages = await findMsg(id, sender);

        return messages
    },

    send: async (id, message, sender, receiver) => {
        if(sender){
            console.log(`입력받은 chatRoom: ${id}, sender: ${sender}, receiver: ${receiver}, message: ${message}`);
            await Chat.findOne({
                where: { status: receiver, id: id  }
            }).then((result) => {
                console.log(result);
                if(result){
                    result.update({ status: '0' });
                }
            });

            await Message.create({
                message: message,
                senderNickname: sender,
                receiverNickname: receiver,
                ChatId: id,
            });

            await Chat.update({
                lastChat: message,
                lastChatDate: new Date(),
            }, { where: { id: id }});

            const msg = await Message.findOne({
                where: { ChatId: id},
                order: literal('createdAt DESC')
            });

            return { message: msg.dataValues.message, createdAt: msg.dataValues.createdAt, senderNickname: msg.dataValues.senderNickname };

        }

    },

    leave: async (roomId, nickname, receiver) => {
        try{
            let { status } = await Chat.findOne({ where: { id: roomId }, attributes: ['status'], raw: true });
            status = status === 0;
            if(status) {
                await Message.destroy({where: {ChatId: roomId}})
                await Chat.destroy({where: { id: roomId }});
            }else{
                await Chat.update({ status: nickname }, {where: {id: roomId}});
                await Message.findAll({where: {status: 0, ChatId: roomId}}).then((result) => {
                    result.forEach((data) =>{
                        data.update({status: nickname});
                    })
                });
                await Message.findAll({where: {status: receiver, ChatId: roomId}}).then((result) => {
                    result.forEach((data) =>{
                        data.update({status: 1});
                    })
                });
            }

            let chatRoom = await Chat.findAll({
                where: {
                    [Op.or] : [{[Op.and]: [{senderNickname: nickname }, { status: { [Op.not] : nickname } } ] }, {[Op.and]: [{receiverNickname: nickname}, {status: {[Op.not]: nickname}}]}]
                },
                include: [ { model: User, attributes: ['profile_img'], as: 'Receiver' }, { model: User, attributes: ['profile_img'], as: 'Sender' } ],
                attributes: ['id', 'lastChat', 'lastChatDate', 'senderNickname', 'receiverNickname'],
                raw: true
            });
            console.log(chatRoom);

            const chatRoomName = chatRoom.map((a) => {
                let profile_img;
                const message = findMsg(a.id, a.senderNickname);
                if(nickname === a.senderNickname){
                    profile_img = a['Receiver.profile_img'];
                    if(message){
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                    }else{
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChatDate: a.lastChatDate }
                    }
                }else if(nickname === a.receiverNickname){
                    profile_img = a['Sender.profile_img'];
                    if(message){
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                    }else{
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChatDate: a.lastChatDate }
                    }
                }
            });

            console.log(chatRoomName)
            return chatRoomName
        } catch (e) {
            console.log('sequelize Err')
        }
        //await Chat.update({ }, { where: { id: roomId } })
    },
}
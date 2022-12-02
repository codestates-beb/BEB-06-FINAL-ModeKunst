const { Chat, Message, User } = require('../../models');
const { Op, literal, fn} = require('sequelize');

async function findMsg(roomId, status){
    return await Message.findAll({
        where: { ChatId: roomId, status: {[Op.and] : ['0', {[Op.and] : [{[Op.not]: 1}, {[Op.not]: status}]}]}},
        attributes: ['message', 'createdAt', 'senderNickname'],
        order: literal('createdAt ASC'),
        raw: true
    });
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


            const chatRoomName = chatRoom.map((a) => {
                let profile_img;
                const message = findMsg(a.id, a.senderNickname);
                if(sender === a.senderNickname){
                    profile_img = a['Receiver.profile_img'];
                    if(message){
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                    }else{
                        return { id: a.id, name: a.receiverNickname, profile_img: profile_img, lastChatDate: a.lastChatDate }
                    }
                }else if(sender === a.receiverNickname){
                    profile_img = a['Sender.profile_img'];
                    if(message){
                        return { id: a.id, name: a.senderNickname, profile_img: profile_img, lastChat: a.lastChat, lastChatDate: a.lastChatDate }
                    }else{
                        return { id: a.id, name: a.senderNickname, profile_img: profile_img, lastChatDate: a.lastChatDate }
                    }
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
}
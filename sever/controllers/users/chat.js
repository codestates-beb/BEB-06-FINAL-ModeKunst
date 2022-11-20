const { Chat, Message } = require('../../models');

module.exports = {

    find: async (req, res) => {
      const { sender } = req.params;
        console.log(`입력 받은 sender: ${sender}`);

        const createBySender = await Chat.findAll({
            where: { senderNickname: sender },
            raw: true
        });
        const createByOther = await Chat.findAll({
            where: { receiverNickname: sender },
            raw: true
        });

        //console.log(createBySender);
        const receiver = createBySender.map((a,i ,z) => {
            console.log(z);
            console.log(a.id);
            console.log(a.receiverNickname)
        })
        //console.log(createByOther);

    },

    create: async (req, res) => {
        const { sender, receiver } = req.params;
        console.log(`입력 받은 sender: ${sender}, receiver: ${receiver}`);

        const senderHasChat = await Chat.findOne({
            where: { senderNickname: sender, receiverNickname: receiver }
        });

        if(!senderHasChat){
            const receiverHasChat = await Chat.findOne({
                where: { senderNickname: receiver, receiverNickname: sender }
            });
            if(!receiverHasChat){
                await Chat.create({
                    senderNickname: sender,
                    receiverNickname: receiver
                });
                res.status(200).json({
                    message: '채팅방이 개설 되었습니다.'
                })
            }else{
                const message = await Chat.findAll({
                    include: [
                        { model: Message, where: { ChatId: receiverHasChat.dataValues.id } }
                    ],
                    raw: true
                });
                console.log(message);
                res.status(200).json({
                    message: '채팅방이 이미 존재합니다.',
                    data: {

                    }
                })
            }
        } else {
            const messages = await Chat.findAll({
                include: [
                    { model: Message, where: { ChatId: senderHasChat.dataValues.id }}
                ],
                raw: true
            });
            console.log(messages);

            res.status(200).json({
                message: '채팅방이 이미 존재합니다.',
                data: {

                }
            })
        }

    },

    send: async (req, res) => {
        const { sender, receiver } = req.params;
        const { message, chatRoom } = req.body;
        console.log(`입력받은 chatRoom: ${chatRoom}, sender: ${sender}, receiver: ${receiver}, message: ${message}`);

        await Message.create({
            message: message,
            senderNickname: sender,
            receiverNickname: receiver,
            ChatId: chatRoom
        });

        res.status(200).json({
            message: `${receiver}님에게 message를 보냈습니다.`
        })
    },

    delete: async (req, res) => {

    },
}
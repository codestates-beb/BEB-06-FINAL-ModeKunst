const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                deleteUser1: {
                    type: Sequelize.STRING
                },
                deleteUser2: {
                    type: Sequelize.STRING
                },

            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Chat',
                tableName: 'chats',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        )
    }

    static associate(db){
        db.Chat.belongsTo(db.User, {
            foreignKey: 'senderNickname',
            as: 'Sender'
        });
        db.Chat.belongsTo(db.User, {
            foreignKey: 'receiverNickname',
            as: 'Receiver'
        });
        // db.Chat.belongsTo(db.User, {
        //     foreignKey: 'sender'
        // });
        // db.Chat.belongsTo(db.User, {
        //     foreignKey: 'receiver'
        // });
        db.Chat.hasMany(db.Message,{
            as: 'Room'
        });
    }
}
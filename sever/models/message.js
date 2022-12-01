const Sequelize = require('sequelize');

module.exports = class Message extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                message: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                status: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Message',
                tableName: 'messages',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        )
    }

    static associate(db){
        db.Message.belongsTo(db.User, {
            foreignKey: 'senderNickname',
            as: 'Sender'
        });
        db.Message.belongsTo(db.User, {
            foreignKey: 'receiverNickname',
            as: 'Receiver'
        });
        db.Message.belongsTo(db.Chat);
    }
}
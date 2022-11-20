const Sequelize = require('sequelize');

module.exports = class Sms extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                phone_number: {
                    type: Sequelize.STRING,
                },
                code: {
                    type: Sequelize.STRING,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Sms',
                tableName: 'sms',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
}
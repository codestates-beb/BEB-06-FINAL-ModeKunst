const Sequlize = require('sequelize');
const Sequelize = require("sequelize");


module.exports = class Email extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                email: {
                    type: Sequelize.STRING,
                },
                code: {
                    type: Sequelize.STRING,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Email',
                tableName: 'emails',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
}
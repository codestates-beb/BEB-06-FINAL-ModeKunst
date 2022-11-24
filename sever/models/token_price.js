const Sequelize = require('sequelize');


module.exports = class Token_price extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                signup:{
                    type: Sequelize.INTEGER,
                    defaultValue: 5,
                },
                login: {
                    type: Sequelize.INTEGER,
                    defaultValue: 1,
                },
                write_post_info: {
                    type: Sequelize.INTEGER,
                    defaultValue: 10,
                },
                write_post: {
                    type: Sequelize.INTEGER,
                    defaultValue: 5,
                },
                top_post: {
                    type: Sequelize.INTEGER,
                    defaultValue: 20,
                },
                review: {
                    type: Sequelize.INTEGER,
                    defaultValue: 2,
                },
                follow_server_price: {
                    type: Sequelize.INTEGER,
                    defaultValue: 10,
                },
                follow_user_price: {
                    type: Sequelize.INTEGER,
                    defaultValue: 5,
                },
                like_sever_price: {
                    type: Sequelize.INTEGER,
                    defaultValue: 1,
                },
                like_user_price: {
                    type: Sequelize.INTEGER,
                    defaultValue: 1,
                },
                get_nft: {
                    type: Sequelize.INTEGER,
                    defaultValue: 10,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Token_price',
                tableName: 'token_price',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }
}
const Sequelize = require('sequelize');

module.exports = class Server extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                address: {
                    type: Sequelize.STRING,
                    primaryKey: true,
                },
                eth_amount: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                erc20: {
                    type: Sequelize.STRING,
                },
                erc721: {
                    type: Sequelize.STRING,
                },
                erc20_name: {
                    type: Sequelize.STRING,
                },
                erc20_symbol: {
                    type: Sequelize.STRING,
                },
                erc20_img: {
                    type: Sequelize.STRING,
                },
                point_amount: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0,
                },
                used_point: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0,
                },
                token_amount: {
                    type: Sequelize.BIGINT,
                },
                erc721_name: {
                    type: Sequelize.STRING,
                },
                erc721_symbol: {
                    type: Sequelize.STRING,
                },
                nft_amount: {
                    type: Sequelize.INTEGER,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Server',
                tableName: 'servers',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        )
    }
}
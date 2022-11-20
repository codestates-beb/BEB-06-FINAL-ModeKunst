const Sequelize = require("sequelize");

module.exports = class Token extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                image: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                tx_hash: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                token_url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Token',
                tableName: 'tokens',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){
        db.Token.belongsTo(db.User);
    }
}
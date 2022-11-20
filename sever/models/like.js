const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {

            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                underscored: false,
                modelName: 'Like',
                tableName: 'likes',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        )
    }

    static associate(db){
        db.Like.belongsTo(db.User);
        db.Like.belongsTo(db.Post);
    }
}
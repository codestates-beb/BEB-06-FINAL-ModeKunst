const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                content: {
                    type: Sequelize.STRING,
                },
            }, {
                sequelize,
                timestamps: true,
                paranoid: true,
                underscored: false,
                modelName: 'Review',
                tableName: 'reviews',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){
        db.Review.belongsTo(db.User);
        db.Review.belongsTo(db.Post);
    }
}
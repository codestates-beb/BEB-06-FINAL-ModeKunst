const Sequelize = require('sequelize');

module.exports = class Top_post extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {

            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Top_post',
                tableName: 'top_posts',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db) {
        db.Top_post.belongsTo(db.Post);
    }
}
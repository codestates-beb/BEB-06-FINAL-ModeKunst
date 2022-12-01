const Sequelize = require('sequelize');

module.exports = class Comment extends  Sequelize.Model{
    static init(sequelize){
        return super.init({
            content:{
                type: Sequelize.STRING,
            },
        },{
            sequelize,
            timestamps: true,
            paranoid: true,
            underscored: false,
            modelName: "Comment",
            tableName: "comments",
            charset: "utf8",
            collate : "utf8_general_ci"
        });
    }
    static associate(db){
        db.Comment.belongsTo(db.Notice);
        db.Comment.belongsTo(db.User,{
            foreignKey:"UserNickname",
            sourceKey:"nickname"
        });
    }
}


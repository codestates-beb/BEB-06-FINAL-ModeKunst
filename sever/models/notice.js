const Sequelize = require('sequelize');

module.exports = class Notice extends Sequelize.Model{
    static init(sequelize){
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                image_1:{
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                image_2:{
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                image_3:{
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                image_4:{
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                image_5:{
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                title:{
                    type: Sequelize.STRING,
                    allowNull:false,
                },
                content:{
                    type:Sequelize.STRING,
                    allowNull: false,
                },
                views:{
                    type:Sequelize.INTEGER,
                    defaultValue:0,
                },
                token_price:{
                    type:Sequelize.INTEGER,
                    defaultValue: 0,
                }

            },
            {sequelize,
                timestamps:true,
                underscored:false,
                modelName:"Notice",
                tableName:"notices",
                charset:'utf8',
                collate:'utf8_general_ci'
            }
        );
    }
    static  associate(db){
        db.Notice.belongsTo(db.Admin);
        db.Notice.hasMany(db.Comment);
    }
}
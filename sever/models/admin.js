const Sequelize = require('sequelize');


module.exports = class Admin extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            nickname: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password:{
                type: Sequelize.STRING,
                allowNull: false,
            }

        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Admin",
            tableName: "admin",
            charset:"utf8",
            collate:"utf8_general_ci"
        });


    }
    static associate(db){
        db.Admin.hasMany(db.Notice);
        db.Admin.hasMany(db.Comment);
    }
}
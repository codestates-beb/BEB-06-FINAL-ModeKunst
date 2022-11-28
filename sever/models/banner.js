const Sequelize = require('sequelize');


module.exports = class Banner extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey:true,

            },
            image :{
                type: Sequelize.STRING,
                allowNull : false,
            },
            url : {
                type: Sequelize.STRING,
                allowNull : false,
            }
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"Banner",
            tableName:"banners",
            charset:"utf8",
            collate:"utf8_general_ci"
        });
    }
}
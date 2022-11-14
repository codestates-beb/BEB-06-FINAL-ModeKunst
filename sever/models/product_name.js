const Sequelize = require('sequelize');

module.exports = class Product_name extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                outer: {
                    type:Sequelize.STRING,
                },
                top: {
                    type:Sequelize.STRING,
                },
                pants: {
                    type:Sequelize.STRING,
                },
                shoes: {
                    type:Sequelize.STRING,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Product_name',
                tableName: 'product_names',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){
        db.Product_name.belongsTo(db.Post);
    }
}
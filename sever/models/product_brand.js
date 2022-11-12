const Sequelize = require('sequelize');

module.exports = class Product_brand extends Sequelize.Model {
    static init(sequelize){
        return super.init(
            {
                outer: {
                    type: Sequelize.STRING,
                },
                top: {
                    type: Sequelize.STRING,
                },
                pants: {
                    type: Sequelize.STRING,
                },
                shoes: {
                    type: Sequelize.STRING,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Product_brand',
                tableName: 'product_brands',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){
        db.Product_brand.belongsTo(db.Post);
    }
}
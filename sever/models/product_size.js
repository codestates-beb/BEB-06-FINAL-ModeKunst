const Sequelize = require('sequelize');

module.exports = class Product_size extends Sequelize.Model {
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
                    type: Sequelize.INTEGER,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'Product_size',
                tableName: 'product_sizes',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){
        db.Product_size.belongsTo(db.Post);
    }
}
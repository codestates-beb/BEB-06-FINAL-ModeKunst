const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {

            },
            {
                sequelize,
                timestamps: true,
                // timestamps: false,
                underscored: false,
                paranoid: true,
                modelName: "Follow",
                tableName: "follows",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {

    }
};

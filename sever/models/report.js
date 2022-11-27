const Sequelize = require("sequelize");

module.exports = class Report extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {

            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                paranoid: true,
                modelName: "Report",
                tableName: "reports",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {
        db.Follow.belongsTo(db.User, {
            foreignKey: 'reporter',
            as: 'Reporter'
        });
        db.Follow.belongsTo(db.User, {
            foreignKey: 'reported',
            as: 'Reported'
        });
    }
};

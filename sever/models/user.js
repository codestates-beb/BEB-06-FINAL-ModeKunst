const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                nickname: {
                    type: Sequelize.STRING,
                    primaryKey: true,
                },

                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                profile_img: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                phone_number: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                height: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                weight: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                gender: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                point_amount: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                token_amount: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                },
                sns_url: {
                    type: Sequelize.STRING,
                },
                login_at: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0,
                },
                followers_num: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0,
                },
                followings_num: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0,
                },
                write_count: {
                    type: Sequelize.INTEGER,
                    defaultValue: 5,
                },
                reported_amount: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "User",
                tableName: "users",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Follow, {
            foreignKey: "follower",
            as: 'Follower'
        });
        db.User.hasMany(db.Follow, {
            foreignKey: "following",
            as: 'Following'
        });
        db.User.hasMany(db.Report, {
            foreignKey: 'reporter',
            as: 'Reporter',
        });
        db.User.hasMany(db.Report, {
            foreignKey: 'reported',
            as: 'Reported',
        });
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Token);
        db.User.hasMany(db.Like);
        db.User.hasMany(db.Review);
        // socket부분
        db.User.hasMany(db.Chat, {
            foreignKey: 'senderNickname',
            as: 'Sender',
        });
        db.User.hasMany(db.Chat, {
            foreignKey: 'receiverNickname',
            as: 'Receiver',
        });
        db.User.hasMany(db.Message, {
            foreignKey: 'senderNickname',
            as: 'OutgoingMessages'
        });
        db.User.hasMany(db.Message, {
            foreignKey: 'receiverNickname',
            as: 'IncomingMessages'
        });
        db.User.hasOne(db.Comment);

    }
};

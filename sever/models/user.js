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
        token_amount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        sns_url: {
          type: Sequelize.STRING,
        },
        login_at: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        // timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.belongsToMany(db.User, {
      foreignKey: "follower",
      as: "Followings",
      through: "follows",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "following",
      as: "Followers",
      through: "follows",
    });
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Token);
    db.User.hasMany(db.Like);
    db.User.hasMany(db.Review);
    db.User.hasMany(db.Chat, {
        foreignKey: 'senderNickname',
    });
    db.User.hasMany(db.Chat, {
        foreignKey: 'receiverNickname',
    })
      db.User.hasMany(db.Message, {
          foreignKey: 'senderNickname',
          as: 'OutgoingMessages'
      });
      db.User.hasMany(db.Message, {
          foreignKey: 'receiverNickname',
          as: 'IncomingMessages'
      })
  }
};

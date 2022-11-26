const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const User = require('./user');
const Admin = require('./admin');
const Notice = require('./notice');
const Like = require('./like');
const Review = require('./review');
const Post = require('./post');
const Product_brand = require('./product_brand');
const Product_name = require('./product_name');
const Product_size = require('./product_size');
const Token = require('./token');
const Server = require('./server');
const Email = require('./email');
const Sms = require('./sms');
const Chat = require('./chat');
const Message = require('./message');
const Follow = require('./follow');
const Token_price = require('./token_price');

const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

db.sequelize = sequelize;
db.User = User;
db.Admin = Admin;
db.Notice = Notice;
db.Like = Like;
db.Review = Review;
db.Post = Post;
db.Product_brand = Product_brand;
db.Product_name = Product_name;
db.Product_size = Product_size;
db.Token = Token;
db.Server = Server;
db.Email = Email;
db.Sms = Sms;
db.Chat = Chat;
db.Message = Message;
db.Follow = Follow;
db.Token_price = Token_price;

User.init(sequelize);
Admin.init(sequelize);
Notice.init(sequelize);
Like.init(sequelize);
Review.init(sequelize);
Post.init(sequelize);
Product_brand.init(sequelize);
Product_name.init(sequelize);
Product_size.init(sequelize);
Token.init(sequelize);
Server.init(sequelize);
Email.init(sequelize);
Sms.init(sequelize);
Chat.init(sequelize);
Message.init(sequelize);
Follow.init(sequelize);
Token_price.init(sequelize);

User.associate(db);
Like.associate(db);
Review.associate(db);
Post.associate(db);
Product_brand.associate(db);
Product_name.associate(db);
Product_size.associate(db);
Token.associate(db);
Chat.associate(db);
Message.associate(db);
Follow.associate(db);
Notice.associate(db);

module.exports = db;

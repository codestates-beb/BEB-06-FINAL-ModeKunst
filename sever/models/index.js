const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const User = require('./user');
const Like = require('./like');
const Review = require('./review');
const Post = require('./post');
// const Top_post = require('./top_post');
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

const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

db.sequelize = sequelize;
db.User = User;
db.Like = Like;
db.Review = Review;
db.Post = Post;
// db.Top_post = Top_post;
db.Product_brand = Product_brand;
db.Product_name = Product_name;
db.Product_size = Product_size;
db.Token = Token;
db.Server = Server;
db.Email = Email;
db.Sms = Sms;
//socket부분
db.Chat = Chat;
db.Message = Message;
db.Follow = Follow;

User.init(sequelize);
Like.init(sequelize);
Review.init(sequelize);
Post.init(sequelize);
// Top_post.init(sequelize);
Product_brand.init(sequelize);
Product_name.init(sequelize);
Product_size.init(sequelize);
Token.init(sequelize);
Server.init(sequelize);
Email.init(sequelize);
Sms.init(sequelize);
//socket부분
Chat.init(sequelize);
Message.init(sequelize);
Follow.init(sequelize);


User.associate(db);
Like.associate(db);
Review.associate(db);
Post.associate(db);
// Top_post.associate(db);
Product_brand.associate(db);
Product_name.associate(db);
Product_size.associate(db);
Token.associate(db);
//socket부분
Chat.associate(db);
Message.associate(db);
Follow.associate(db);

module.exports = db;

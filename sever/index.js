require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs");

const indexRouter = require("./routes/index");
const { sequelize } = require("./models");
const { insertServerAddress, deploy20, deploy721 } = require("./contract/Web3");
const { create, find, send, join } = require("./socket/chatRoom");

const app = express();
const port = 8000;

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
  })
);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB 연결 성공...");
    insertServerAddress().then(() => {
      deploy20().then(() => {
        deploy721();
      });
    });
  })
  .catch(err => {
    console.error(err);
  });
app.use("/profile_img", express.static("profile_img"));
app.use("/post_img", express.static("post_img"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    sceret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: "localhost",
      path: "/",
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: true,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!`);
  error.status = 404;
  next(error);
});

http.listen(port, () => {
  const profile_dir = "./profile_img";
  const post_dir = "./post_img";
  const notice_dir = "./notice_img"
  if (!fs.existsSync(profile_dir)) {
    fs.mkdirSync(profile_dir);
  }
  if (!fs.existsSync(post_dir)) {
    fs.mkdirSync(post_dir);
  }
  if (!fs.existsSync(notice_dir)){
      fs.mkdirSync(notice_dir);
  }
  console.log("Listening...");
});

let count = 0;

io.on("test", socket => {
  socket.emit('test', 1);

});

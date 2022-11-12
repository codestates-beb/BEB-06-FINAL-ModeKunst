require("dotenv").config();
const { User } = require('./models');
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const indexRouter = require("./routes/index");
const { sequelize } = require("./models");

const app = express();
const port = 8000;

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
        console.log('DB 연결 성공...');
        return User.findAll().then((users) => {
            return users.map((user) => {
                console.log(user);
                console.log(1)
            })
        } )
    })
    .catch((err) => {
        console.error(err);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.listen(port, () => {
  console.log("Listening...");
});

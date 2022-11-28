const { Admin } = require("../../models");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = process.env.SALT_ROUNDS;

module.exports = {
  //회원가입
  post: async (req, res) => {
    try {
      const { email, password, passwordcheck, nickname } = req.body;

      console.log(password == passwordcheck);
      console.log(password);
      console.log(passwordcheck);
      if (passwordcheck == password) {
        const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
        const hash = await bcrypt.hashSync(password, salt);

        await Admin.create({
          nickname: `[Mode]${nickname}`,
          email: email,
          password: hash,
        });

        return res.status(200).json({
          message: "관리자 회원가입에 성공하였습니다.",
          data: {
            email: email,
            nickname: `[Mode]${nickname}`,
          },
        });
      } else if (passwordcheck !== password) {
        return res.status(400).json({ message: "비밀번호가 틀립니다." });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

const User = require("../../models/user");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = process.env.SALT_ROUNDS;

module.exports = {
  // 비밀 번호 수정
  // 와일드 카드로 값이라도 하나 넘겨야할듯
  post: async (req, res) => {
    const email = req.params.email;
    const { firstPassword, secondPassword } = req.body;

    try {
      if ((firstPassword, secondPassword)) {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
          const salt = bcrypt.genSaltSync(parseInt(SALT_ROUNDS));
          const hash = bcrypt.hashSync(secondPassword, salt);

          await User.update({ password: hash }, { where: { email: email } });

          return res
            .status(200)
            .json({ message: "비밀번호가 변경 되었습니다." });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};

const User = require("../../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  // 비밀 번호 확인
  post: async (req, res) => {
    const { password } = req.body;
    //세션으로 유저 찾기
    const user = await User.findOne({
      where: { email: req.session.user.email },
    });

    console.log(` 비밀번호 재확인 :${password}`);
    const passwordCheck = bcrypt.compareSync(password, user.password);
    console.log(passwordCheck, "비밀번호 체크 결과");

    if (passwordCheck) {
      return res.status(200).json({ message: "비밀번호가 일치합니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 틀립니다." });
    }
  },
};

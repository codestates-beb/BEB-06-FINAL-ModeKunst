const User = require("../../models/user");
const { unsubscribe } = require("../../routes");

module.exports = {
  // 회원 탈퇴
  delete: async (req, res) => {
    //세션으로 닉네임 찾기
    const delUser = await User.findOne({
      where: { nickname: req.session.user.nickname },
    });

    try {
      if (delUser) {
        delUser.destroy({
          truncate: true,
        });
        res.status(200).json({ message: "탈퇴 하였습니다." });
      } else {
        res.status(404).json({ message: "err" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

const User = require("../models/user");

module.exports = {
  addFollowing: async (req, res, next) => {
    try {
      //팔로잉 할 때 api 는 /:nickname/follow로 하는것이 좋을듯? 팔로우 취소도 구현
      const user = await User.findOne({
        where: { nickname: req.session.user.nickname },
      }); //세션에 있는 닉네임으로 사용자 확인
      if (user) {
        //user가 다른 사람을 팔로잉에 추가
        await user.addFollowing(req.params.nickname);
        res.send({ message: "팔로우 성공!" });
      } else {
        res.status(404).send({ message: "사용자가 없습니다." });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  //팔로우 취소 기능 구현
  removeFollower: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { nickname: req.params.nickname },
      });
      if (user) {
        await user.removeFollower(req.session.user.nickname);
        res.send({ message: "언팔로우 성공!" });
      } else {
        res.status(404).send({ message: "사용자가 없습니다" });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
};

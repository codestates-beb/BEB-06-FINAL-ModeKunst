const { getAttributes } = require("../../models/user");
const User = require("../../models/user");

module.exports = {
  // 마이 페이지
  get: async (req, res) => {
    //TODO 1. 유저 정보 가져오기
    //TODO 2. 팔로워 숫자 팔로잉 한 정보들 가져오기
    const nickname = req.params.nickname;

    try {
      //유저 정보 가져오기
      const user = await User.findOne({ where: { nickname: nickname } });
      //유저의 팔로워 숫자 가져오기
      const follower = await user.getFollowers();
      const following = await user.getFollowings();

      console.log("유저 정보 : ", user);
      console.log("팔로잉: ", following);
      //follower.length 하면 팔로워 수
      //
      return res.status(200).json({
        userInfo: {
          nickname: user.nickname,
          height: user.height,
          weight: user.weight,
          followerNum: follower.length,
          profile_img: user.profile_img,
        },
        following: following,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

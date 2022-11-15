const { User } = require("../../models");
const bcrypt = require("bcrypt");

module.exports = {
  // 로그인
  post: async (req, res) => {
    const { email, password } = req.body;
    const now = Date.now();

    console.log(`입력 받은 email: ${email}, password: ${password}`);

    if (email && password) {
      const user = await User.findOne({
        where: { email: email },
      });
      //TODO: 로그인시 비크립트로 비밀번호 비교하기(v)
      const comparePassword = bcrypt.compareSync(password, user.password);
      console.log("해시 비교한 결과", comparePassword);

      if (user && comparePassword) {
        delete user.dataValues.password;
        req.session.user = user.dataValues;

        //TODO: 24시간 뒤에 로그인 하면 사용자 토큰 보상
        //TODO:  web3 연결

        return res.status(200).json({
          message: "로그인이 완료되었습니다.",
          data: {
            id: user.dataValues.id,
            address: user.dataValues.address,
            profile_img: user.dataValues.profile_img,
            email: user.dataValues.email,
            nickname: user.dataValues.nickname,
            phone_number: user.dataValues.phone_number,
            sns_url: user.dataValues.sns_url,
            height: user.dataValues.height,
            weight: user.dataValues.weight,
            gender: user.dataValues.gender,
            token_amount: user.dataValues.token_amount,
            follower: user.data,
          },
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "이메일 혹은 비밀번호가 틀렸습니다." });
    }
  },
};

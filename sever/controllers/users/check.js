const { User, Email, Sms } = require("../../models");

module.exports = {
  // 이메일 검증
  email: async (req, res) => {
    const { email, code } = req.body;
    console.log(`입력 받은 email : ${email} code : ${code}`);

    try {
      const emailCode = await Email.findOne({
        where: { email: email, code: code },
      });
      if (emailCode) {
        try {
          await Email.destroy({
            where: { email: email, code: code },
          });

          res.status(200).json({
            message: "인증 되었습니다.",
          });
        } catch (e) {
          console.log("sequelize 에러");
          console.log(e);
        }
      } else {
        res.status(404).json({
          message: "인증코드를 확인 해주세요.",
        });
      }
    } catch (e) {
      console.log("sequelize 에러");
      console.log(e);
    }
  },

  //sms 검증
  sms: async (req, res) => {
    const { phone_number, code } = req.body;
    console.log(`입력 받은 phone_number : ${phone_number}, code : ${code}`);

    const smsCode = await Sms.findOne({
      where: { phone_number: phone_number, code: code },
    });
    if (smsCode) {
      try {
        await Sms.destroy({
          where: { phone_number: phone_number, code: code },
        });

        res.status(200).json({
          message: "인증 되었습니다.",
        });
      } catch (e) {
        console.log("sequelize 에러");
        console.log(e);
      }
    } else {
      res.status(404).json({
        message: "인증코드를 확인 해주세요.",
      });
    }
  },

  // 닉네임 검증
  nickname: async (req, res) => {
    const { nickname } = req.params;
    console.log(`입력받은 nickname : ${nickname}`);

    const user = User.findOne({
      where: { nickname: nickname },
    });

    if (!user) {
      res.status(200).json({
        message: "사용 가능한 닉네임입니다.",
      });
    } else {
      res.status(404).json({
        message: "사용 불가능한 닉네임입니다.",
      });
    }
  },
};

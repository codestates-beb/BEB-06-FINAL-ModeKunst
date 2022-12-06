const { User } = require('../../models');

module.exports = {

    // 이메일 찾기
    email: async (req, res) => {
        const { nickname, phonenumber } = req.params;
        console.log(`입력 받은 nickname: ${nickname}, phonenumber: ${phonenumber}`)

        const user = await User.findOne({
            where: { nickname: nickname, phone_number: phonenumber }
        });

        if(user){
            const email = user.dataValues.email;

            res.status(200).json({
                message: "존재하는 회원입니다",
                data: {
                    "email": email,
                }
            });
        }else {
            res.status(404).json({
                message: "존재하지 않는 회원입니다."
            })
        }

    },

    // 비밀 번호 찾기
    password: async (req, res) => {
        const { email, phonenumber } = req.params;
        console.log(`입력 받은 email: ${email}, phonenumber: ${phonenumber}`);

        const user = await User.findOne({
            where: { email: email, phone_number: phonenumber }
        });


        if(user) {
            res.status(200).json({
                message: "존재하는 회원입니다."
            });
        }else {
            res.status(404).json({
                message: "존재하지 않는 회원입니다."
            });
        }
    },
}
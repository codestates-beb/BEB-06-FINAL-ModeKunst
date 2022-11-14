const { User } =  require('../../models');
const { getAddress } = require('../../contract/Web3');

module.exports = {

    //회원 가입
    post: async (req, res) => {
        try {
            console.log(req.headers);
            console.log(req.file);
            const { host } = req.headers;
            const profile_img  = req.file.path;
            const { email, password, nickname, phone_number, height, weight, gender, sns_url } = req.body;
            console.log(`입력 받은 email: ${email}, password: ${password}, nickname: ${nickname}, phone_number: ${phone_number}, height: ${height}, weight: ${weight}, gender: ${gender}, sns_url ${sns_url}`);

            const address = await getAddress(password);

            try{
                await User.create({
                    nickname: nickname,
                    address: address,
                    profile_img: `http://${host}/${profile_img}`,
                    email: email,
                    password: password,
                    phone_number: phone_number,
                    height: height,
                    weight: weight,
                    gender: gender,
                    sns_url: sns_url,
                });

                res.status(200).json({
                    message: '회원가입이 완료 되었습니다.'
                })
            } catch (e) {
                console.log('sequelize 에러');
                console.log(e);
            }
        } catch (e) {
            console.log('multer 에러');
            console.log(e);
        }
    }
}
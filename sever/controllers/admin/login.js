const {Admin, User} = require('../../models');
const bcrypt = require('bcrypt');

module.exports = {
    //로그인
    post: async(req,res)=>{
        const { email, password} = req.body;

        try{
            const admin = await Admin.findOne({
                where: { email: email },
            });
            if(admin){
                const comparePassword = bcrypt.compareSync(password,admin.password);

                if( comparePassword){
                    delete admin.dataValues.password;
                    req.session.user = admin.dataValues;
                    //로그인한 세션에 관리자 저장
                    return res.status(200).json({
                        message:`${admin.nickname}관리자님 로그인 완료되었습니다.`,
                        data:{
                            email:admin.email,
                            nickname: admin.nickname,
                        }
                    })
                }
                if(!comparePassword){
                    return res.status(404).json({message:"비밀번호가 틀렸습니다."});
                }
            }
            if(!admin){
                return res.status(404).json({message:"존재하지 않는 이메일 입니다."});
            }
        }
        catch(err){
            console.log(err)
        }

    }

}
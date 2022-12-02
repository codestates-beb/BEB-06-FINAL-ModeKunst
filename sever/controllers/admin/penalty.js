const { User } = require('../../models');



module.exports ={
    //유저에게 페널티
    penalty: async(req,res)=>{
        //페널티를 주면 현재 시간에 86400000 추가
        const {nickname} = req.params;
        try{
            //사용자 불러오기 24시간 더해주기
            //로그인 했을 때 24시간 안지나면 게시물 리뷰 작성에 보상 없도록 ,
            await User.update({
                    penalty: Date.now() + 86400000 ,
                }
                ,{where:{nickname:nickname}}
            );

            console.log(Date.now(),'지금');
            console.log(Date.now()+86400000,"내일");

            return res.status(200).json({message:"1일 보상을 중지하였습니다."});


        }catch(err){
            console.log(err);
        }


    },

    //신고 취소
    cancelpenalty: async(req,res)=>{
        const {nickname} = req.params;

        try{

            const user = await User.findOne({
                attributes:["reported_amount"],
                where:{nickname:nickname}
            });

            await User.update({
                    reported_amount: 0,
                }, {where:{nickname:nickname}}
            );

            return res.status(200).json({
                message:"유저의 신고가 취소 되었습니다.(신고 횟수 초기화)"
            })
        } catch(err){
            console.log(err);
        }
    },

    //신고 먹은 사람들 리스트 불러오기
    reportlist: async(req,res)=>{
        try{
            const reportUserList = await User.findAll({
                attributes:["reported_amount","nickname"]
            });

            const reports = reportUserList.map((el,idx)=>{
                return {
                    nickname: el.dataValues.nickname,
                    report_count : el.dataValues.reported_amount,
                }
            })

            return res.status(200).json({reports});


        } catch(err){
            console.log(err);
        }


    },
    penaltyalarm : async(req,res)=>{
        //로그인한 사용자
        const nickname = req.session.user?.nickname;

        console.log(nickname);
        try{
            const userPenalty = await User.findOne({
                attributes:["penalty"],
                where:{nickname:nickname}
            });
            //페널티가 있는 사람이라면? (24시간 안지남) -> 남은 시간도 알려주기
            if(userPenalty.dataValues.penalty){
                if(Date.now() >= userPenalty.dataValues.penalty){
                    await User.update({
                        penalty:0},
                    {where:{nickname:nickname}
                    });
                    return res.json({message:"정지가 해제되었습니다."})
                }

                return res.json({message:"1일 정지당한 계정입니다. 토큰 보상이 제한됩니다."})
            }

            return res.json({message:"정지당하지 않은 계정"})

        }catch(err){
            console.log(err);
            return res.status(404).json({message:"error!"});
        }


    }



}
const {Post,User} =require('../../models');

module.exports ={
    get:async(req,res)=>{
        //좋아요 높은 순 (게시물) - 상위 10개
        const likes_rank = await Post.findAll({
            limit: 10,
            order:[["likes_num","DESC"]],
            attributes:["id","UserNickname","title","content","likes_num","createdAt"]}
        )

        const likes_rank_arr = likes_rank.map((el)=>el.dataValues);
        // console.log('좋아요 게시물 랭킹 10위',likes_rank_arr);

        //팔로우 많은 순 (유저)
        const follower_rank = await User.findAll({
            limit:10,
            order:[["followers_num","DESC"]],
            attributes:["nickname","email","followers_num","createdAt"]
        });

        const follower_rank_arr = follower_rank.map((el)=>el.dataValues);
        // console.log("팔로워 수 많은 유저 랭킹",follower_rank_arr);

        //리뷰가 많은 순 (게시물)
        const reviews_rank = await Post.findAll({
            limit:10,
            order:[["reviews_num","DESC"]],
            attributes:["id","UserNickname","title","content","reviews_num","createdAt"]
        });

        const reviews_rank_arr = reviews_rank.map((el)=>el.dataValues);
        // console.log("리뷰수 많은 게시물 랭킹",reviews_rank_arr);

        //총 회원 수
        const user_amount = await User.count();
        console.log(user_amount,"총 유저수");
        //남자 여자 성비율 (남:여)
        const male_amount = await User.count({where:{gender:"male"}});
        const female_amount = await User.count({where:{gender:"female"}});
        const male_ratio = (male_amount/user_amount)*100;
        const female_ratio =(female_amount/user_amount)*100;

        // console.log("남자 비율 : ",male_ratio.toFixed(1),"여자 비율 :",female_ratio.toFixed(1));

        return res.status(200).json({
            message:"데이터 값",
            data:{
                people_amount: user_amount,
                people_ratio:{
                    male_ratio:male_ratio.toFixed(1),
                    female_ratio:female_ratio.toFixed(1),
                },
                popular_post:{
                    likes_rank_arr
                },
                reviews_rank_post:{
                    reviews_rank_arr
                },
                popular_people:{
                    follower_rank_arr
                },


            }
        })

    }

}
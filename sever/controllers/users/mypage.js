const { User, Follow, Post, Token } = require("../../models");
const { literal  } = require('sequelize');
module.exports = {
  // 마이 페이지
  get: async (req, res) => {
    //TODO 1. 유저 정보 가져오기
    //TODO 2. 팔로워 숫자 팔로잉 한 정보들 가져오기
    const nickname = req.params.nickname;
    console.log(`입력 받은 nickname: ${nickname}`);
    try {
      //유저 정보 가져오기
      const user = await User.findOne({
        where: { nickname: nickname },
        attributes: ['nickname', 'profile_img', 'height', 'weight', 'gender', 'sns_url'],
        raw: true
      });

      const posts = await Post.findAll({
        where: {UserNickname: nickname},
        order: literal('views DESC'),
        attributes: ['id', 'image_1', 'title', 'content', 'category', 'views', 'createdAt', 'UserNickname'],
        raw: true
      });

      // 현재 시간
      const today = new Date();

      const dateFormatPosts = posts.map((post) =>{
        return new Date(post.createdAt);
      });


      const diff = dateFormatPosts.map((time) => {
        const sec = Math.floor((today - time) / 1000);
        if(sec < 60) return '방금 전'
        const min = sec / 60
        if(min < 60) return `${Math.floor(min)}분 전`
        const hour = min / 60
        if(hour < 24) return `${Math.floor(hour)}시간 전`
        const day = hour / 24
        if(day / 7) return `${Math.floor(day)}일 전`
        const week = day / 7
        if(week < 5) return `${Math.floor(week)}주 전`
        const month = day / 30
        if(month < 12) return `${Math.floor(month)}개월 전`
        const year = day / 365
        return `${Math.floor(year)}`
      });


      posts.map((post, i) => {
        post.createdAt = diff[i]
      });

      if(user){
        try{
          const followers = await Follow.findAll({
            where: { following: req.params.nickname },
            include: { model: User, attributes:['profile_img'], as: 'Follower'},
            attributes: ['Follower'],
            raw: true
          });

          const realFollowers = [];
          for(const follower of followers){
            if(!follower.follow_amount){
              const follow_amount =  await Follow.count({where: {following: follower.Follower}});
              let data = { ...follower, follow_amount: follow_amount }
              realFollowers.push(data);
            }
          }

          const followings = await Follow.findAll({
            where: { follower: req.params.nickname },
            include: { model: User, attributes:['profile_img'], as: 'Following'},
            attributes: ['Following'],
            raw: true
          });

          const realFollowings = [];
          for(const following of followings){
            if(!following.follow_amount){
              const follow_amount =  await Follow.count({where: {following: following.Following}});
              let data = { ...following, follow_amount: follow_amount }
              realFollowings.push(data);
            }
          }
          console.log(realFollowings)


          return res.status(200).json({
            message: `${nickname}님의 마이페이지`,
            data: {
                user,
                posts,
                followers: realFollowers,
                followings: realFollowings,
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};

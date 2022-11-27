const { User, Follow, Post, Token, Like } = require("../../models");
const { literal, Op  } = require('sequelize');
const { many } = require('../function/createdAt');

module.exports = {
  // 마이 페이지
  get: async (req, res) => {
    //TODO 1. 유저 정보 가져오기
    //TODO 2. 팔로워 숫자 팔로잉 한 정보들 가져오기

    const login_user = req.session.user?.nickname;
    const nickname = req.params.nickname;
    console.log(`입력 받은 nickname: ${nickname}`);
    try {
      //유저 정보 가져오기
      const user = await User.findOne({
        where: { nickname: nickname },
        attributes: ['nickname', 'profile_img', 'height', 'weight', 'gender', 'sns_url', 'followers_num'],
        raw: true
      });

      let isFollow = await Follow.findOne({
        where: { follower: login_user, following: nickname}
      });

      isFollow = !!isFollow;

      let posts = await Post.findAll({
        where: {UserNickname: nickname},
        order: literal('likes_num DESC'),
        attributes: ['id', 'image_1', 'title', 'content', 'category', 'views', 'createdAt', 'UserNickname', 'likes_num', 'reviews_num'],
        raw: true
      });


      const dateFormatPosts = posts.map((post) =>{
        return new Date(post.createdAt);
      });

      let diff = many(dateFormatPosts);

      posts.map((post, i) => {
        post.createdAt = diff[i]
      });


      let likePosts = await Post.findAll({
        include: [ { model: Like, attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'UserNickname', 'PostId'] }, where: { UserNickname: nickname } }, { model: User, attributes: ['profile_img'] } ],
        attributes: ['id', 'image_1', 'title', 'content', 'category', 'views', 'createdAt', 'UserNickname', 'likes_num', 'reviews_num'],
        where: {UserNickname : { [Op.ne]: nickname}},
        raw: true,
      });

      const dateFormatLikePosts = likePosts.map((post) =>{
        return new Date(post.createdAt);
      });

      diff = many(dateFormatLikePosts);

      likePosts.map((post, i) => {
        post.createdAt = diff[i]
      })

      likePosts = likePosts.map((post, i) => {
        let data = { profile_img: post['User.profile_img']};
        delete (post['User.profile_img']);
        return {...post, ...data}
      });

      if(user){
        try{
          let followers = await Follow.findAll({
            where: { following: req.params.nickname },
            include: { model: User, attributes:['profile_img'], as: 'Follower'},
            attributes: ['Follower'],
            raw: true
          });
          followers = followers.map((a) => {
            let data = { profile_img : a['Follower.profile_img']}
            delete (a['Follower.profile_img']);
            return {...a, ...data}
          })

          const realFollowers = [];
          for(const follower of followers){
            if(!follower.follow_amount){
              const follow_amount =  await Follow.count({where: {following: follower.Follower}});
              let data = { ...follower, follow_amount: follow_amount }
              realFollowers.push(data);
            }
          }

          let followings = await Follow.findAll({
            where: { follower: req.params.nickname },
            include: { model: User, attributes:['profile_img'], as: 'Following'},
            attributes: ['Following'],
            raw: true
          });

          followings = followings.map((a) => {
            let data = { profile_img : a['Following.profile_img']};
            delete (a['Following.profile_img']);
            return  {...a, ...data}
          })

          const realFollowings = [];
          for(const following of followings){
            if(!following.follow_amount){
              const follow_amount =  await Follow.count({where: {following: following.Following}});
              let data = { ...following, follow_amount: follow_amount }
              realFollowings.push(data);
            }
          }


          return res.status(200).json({
            message: `${nickname}님의 마이페이지`,
            data: {
                user,
                posts,
                likePosts,
                followers: realFollowers,
                followings: realFollowings,
                isFollow
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

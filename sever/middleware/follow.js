const  { User, Follow } = require('../models');
const { web3, abi20 } = require('../contract/Web3');

module.exports = {
  addFollowing: async (req, res, next) => {
    try {
      const follower = req.session.user.nickname;
      const following = req.params.nickname;

      const token_amount = User.findOne({
        where: { nickname: follower },
        attributes: ['token_amount']
      });

      // 팔로우 하는 사람이 팔로워
      // 팔로잉
      const isFollow = await Follow.findOne({
        where: { follower: follower, following: following },
        paranoid: false
      });

      if(!isFollow){

        if(token_amount < 15){
          res.status(401).json({
            message: '보유 토큰 양이 부족합니다.'
          })
        }else{

          await Follow.create({ follower: follower, following: following });

          const followers = await Follow.findAll({
            where: { following: req.params.nickname },
            include: { model: User, attributes:['profile_img'], as: 'Follower'},
            attributes: ['Follower'],
            raw: true
          });

          const following_count = await Follow.count({where: {following: req.params.nickname}});

          res.status(200).json({
            message: `${req.params.nickname}님을 팔로우 했습니다.`,
            data: {
              following_count,
              followers,
              isFollow: true,
            }
          });
        }
      }else{

        await Follow.destroy({ where: { follower: follower, following: following }, force: true });

        await Follow.create({ follower: follower, following: following });

        const followers = await Follow.findAll({
          where: { following: req.params.nickname },
          include: { model: User, attributes:['profile_img'], as: 'Follower'},
          attributes: ['Follower'],
          raw: true
        });

        const following_count = await Follow.count({where: {following: req.params.nickname}});

        res.status(200).json({
          message: `${req.params.nickname}님을 팔로우 했습니다.`,
          data: {
            following_count,
            followers,
            isFollow: true,
          }
        });
      }

    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  //팔로우 취소 기능 구현
  removeFollower: async (req, res, next) => {
    try {
      const follower = req.session.user.nickname;
      const following = req.params.nickname;

      await Follow.destroy({
        where: { follower: follower, following: following }
      });

      const followers = await Follow.findAll({
        where: { following: req.params.nickname },
        include: { model: User, attributes:['profile_img'], as: 'Follower'},
        attributes: ['follower'],
        raw: true
      });

      const following_count = await Follow.count({where: {following: req.params.nickname}});


      res.status(200).json({
        message: `${following}님을 언팔로우 했습니다.`,
        data: {
          following_count,
          followers,
          isFollow: false,
        }
      })

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
};

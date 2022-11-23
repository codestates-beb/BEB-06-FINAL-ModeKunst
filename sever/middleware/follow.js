const  { User, Follow,Server, Token_price} = require('../models');
const { web3, abi20, serverPKey, getBalance } = require('../contract/Web3');
//팔로워 늘었을 때 : 5지급 받기
//팔로우 눌렀을 때 : 15 지출 서버 ( 10개 유저한테, 5개 지출 )


module.exports = {
  addFollowing: async (req, res, next) => {
    try {
      const follower = req.session.user.nickname; //로그인한 사람이 팔로우 버튼
      const following = req.params.nickname; //팔로우 하는 사람

      const token_amount = await User.findOne({
        where: { nickname: follower },
        attributes: ['token_amount']
      });

      // 팔로우 하는 사람이 팔로워
      // 팔로잉
      const isFollow = await Follow.findOne({
        where: { follower: follower, following: following },
        paranoid: false
      });

      const { follow_server_price, follow_user_price } = await Token_price.findOne({ where: { id: 1 }, attributes: ['follow_server_price', 'follow_user_price'], raw: true });
      const total_price = follow_server_price + follow_user_price;


      if (!isFollow) {

        if( token_amount.dataValues.token_amount < total_price){
          res.status(401).json({
            message: '보유 토큰 양이 부족합니다.'
          })
        } else {
          //팔로우 누르는 사람이 지출하는 토큰의 총 갯수 15개

          const serverInfo = await Server.findOne({
            attributes: ['address', 'erc20'],
            raw: true
          });

          const { address, erc20 } = serverInfo;
          const contract = await new web3.eth.Contract(abi20, erc20);
          const followingUserInfo = await User.findOne({ where: { nickname: following } });

          const ApporveData = contract.methods.approve(req.session.user.address, total_price).encodeABI();
          const approveRawTransaction = { 'to': erc20, 'gas': 100000, 'data': ApporveData };
          const approveSignTx = await web3.eth.accounts.signTransaction(approveRawTransaction, serverPKey);
          const approveSendSignTx = await web3.eth.sendSignedTransaction(approveSignTx.rawTransaction);

          console.log('사용자 토큰 갯수 : ',await contract.methods.balanceOf(req.session.user.address).call())

          //서버에게 보내는 양 10개
          const transferfromData = contract.methods.transferFrom(req.session.user.address, address, follow_server_price).encodeABI();
          const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferfromData };
          const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
          const transferSendSignTx = await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);

          //유저에게 보내는 트랜잭션 5개
          const transferfromData2 = contract.methods.transferFrom(req.session.user.address, followingUserInfo.address, follow_user_price).encodeABI();
          const transferRawTransaction2 = { 'to': erc20, 'gas': 100000, "data": transferfromData2 };
          const transferSignTx2 = await web3.eth.accounts.signTransaction(transferRawTransaction2, serverPKey);
          const transferSendSignTx2 = await web3.eth.sendSignedTransaction(transferSignTx2.rawTransaction);


          //트랜잭션 발생 후 서버토큰양과, 클라이언트 토큰 양
          const server_eth = await getBalance(address);
          const serverBalanceResult = await contract.methods.balanceOf(address).call();
          const followerUserBalanceResult = await contract.methods.balanceOf(req.session.user.address).call();
          const followingUserBalanceResult = await contract.methods.balanceOf(followingUserInfo.address).call();

          await Server.update({
            eth_amount: server_eth,
            token_amount: serverBalanceResult
          }, { where: { address: address } });


          await Follow.create({ follower: follower, following: following });

          const followers = await Follow.findAll({
            where: { following: following },
            include: { model: User, attributes:['profile_img'], as: 'Follower'},
            attributes: ['Follower'],
            raw: true
          });

          const followers_count = await Follow.count({ where: { following: following} });//팔로잉 한 수 (팔로우 당한 사람을 팔로우 한 수)
          // const follow_count = await Follow.count({ where: { follower: req.params.nickname } }) //팔로우 당한 사람이 팔로잉 한 수

          // const followers_count_login = await Follow.count({ where: { following: req.session.user.nickname } }); //로그인한 사람(팔로잉 하는 사람을 팔로우 한 수 )
          const follow_count_login = await Follow.count({ where: { follower: follower} }); //로그인한 사람이 팔로잉 한수

          //팔로우 받은 사람 토큰 갯수 업데이트
          //팔로잉 당한 사람 req.params.nickname 주인
          await User.update({
            followers_num: followers_count,
            token_amount: followingUserBalanceResult
            // followings_num: follow_count
          }, { where: { nickname: req.params.nickname } });

          //팔로우 한 사람 토큰 갯수 업데이트
          //로그인한 사람(팔로우 하는사람) req.session.user 주인
          await User.update({
            // follwers_num: followers_count_login,
            token_amount: followerUserBalanceResult,
            followings_num: follow_count_login
          }, { where: { nickname: req.session.user.nickname } });


          res.status(200).json({
            message: `${req.params.nickname}님을 팔로우 했습니다.`,
            data: {
              followers_count, //팔로우한 숫자들
              followers,
              isFollow: true,
            }
          });
        }
      } else {
        //취소했다가 다시 재 팔로우

        await Follow.destroy({ where: { follower: follower, following: following }, force: true });

        await Follow.create({ follower: follower, following: following });

        const followers = await Follow.findAll({
          where: { following: req.params.nickname },
          include: { model: User, attributes:['profile_img'], as: 'Follower'},
          attributes: ['Follower'],
          raw: true
        });

        const followers_count = await Follow.count({ where: { following: req.params.nickname } });//팔로잉 한 수 (팔로우 당한 사람을 팔로우 한 수)
        // const follow_count = await Follow.count({ where: { follower: req.params.nickname } }) //팔로우 당한 사람이 팔로잉 한 수

        // const followers_count_login = await Follow.count({ where: { following: req.session.user.nickname } }); //로그인한 사람(팔로잉 하는 사람을 팔로우 한 수 )
        const follow_count_login = await Follow.count({ where: { follower: req.session.user.nickname } }); //로그인한 사람이 팔로잉 한수


        //팔로잉 당한 사람 req.params.nickname 주인
        await User.update({
          followers_num: followers_count,
          // followings_num: follow_count
        }, { where: { nickname: req.params.nickname } });

        //로그인한 사람(팔로우 하는사람) req.session.user 주인
        await User.update({
          // follwers_num: followers_count_login,
          followings_num: follow_count_login
        }, { where: { nickname: req.session.user.nickname } });

        res.status(200).json({
          message: `${req.params.nickname}님을 팔로우 했습니다.`,
          data: {
            followers_count,
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

      const followers_count = await Follow.count({ where: { following: req.params.nickname } });//팔로잉 한 수 (팔로우 당한 사람을 팔로우 한 수)
      // const follow_count = await Follow.count({ where: { follower: req.params.nickname } }) //팔로우 당한 사람이 팔로잉 한 수

      // const followers_count_login = await Follow.count({ where: { following: req.session.user.nickname } }); //로그인한 사람(팔로잉 하는 사람을 팔로우 한 수 )
      const follow_count_login = await Follow.count({ where: { follower: req.session.user.nickname } }); //로그인한 사람이 팔로잉 한수


      //팔로잉 당한 사람 req.params.nickname 주인
      await User.update({
        followers_num: followers_count,
        // followings_num: follow_count
      }, { where: { nickname: req.params.nickname } });

      //로그인한 사람(팔로우 하는사람) req.session.user 주인
      await User.update({
        // follwers_num: followers_count_login,
        followings_num: follow_count_login
      }, { where: { nickname: req.session.user.nickname } });


      res.status(200).json({
        message: `${following}님을 언팔로우 했습니다.`,
        data: {
          followers_count,
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

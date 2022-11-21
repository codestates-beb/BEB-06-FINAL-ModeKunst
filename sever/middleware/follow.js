const  { User, Follow,Server } = require('../models');
const { web3, abi20, serverPKey, getBalance } = require('../contract/Web3');
//팔로워 늘었을 때 : 5지급 받기 
//팔로우 눌렀을 때 15 지출 서버 :10개 유저한테 5개 지출 


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

      const server_Accounts = await web3.eth.getAccounts();
      const serverInfo = await Server.findOne({
        attributes: ['address', 'erc20'],
        where: { address: server_Accounts[0] }
      });
      const serverAddress = serverInfo.dataValues.address;
      const erc20 = serverInfo.dataValues.erc20;
      const contract = await new web3.eth.Contract(abi20, erc20);
      const followingUserInfo = await User.findOne({ where: { nickname: following } });

      if (!isFollow) {

        if( token_amount.dataValues.token_amount < 15){
          res.status(401).json({
            message: '보유 토큰 양이 부족합니다.'
          })
        } else {
          //팔로우 누르는 사람이 지출하는 토큰의 총 갯수 15개 
          console.log('아니...',await contract.methods.allowance(req.session.user.address, serverAddress).call());
          const ApporveData = await contract.methods.approve(req.session.user.address, 15).encodeABI();
          const approveRawTransaction = { 'to': erc20, 'gas': 100000, 'data': ApporveData };
          const approveSignTx = await web3.eth.accounts.signTransaction(approveRawTransaction, serverPKey);
          const approveSendSignTx = await web3.eth.sendSignedTransaction(approveSignTx.rawTransaction); 
          console.log('아니...1');
          
          console.log('사용자 토큰 갯수 : ',await contract.methods.balanceOf(req.session.user.address).call())

          //서버에게 보내는 양 10개
          const transferfromData = await contract.methods.transferFrom(req.session.user.address, serverAddress, 10).encodeABI();
          const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferfromData };
          const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
          const transferSendSignTx = await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);

          //유저에게 보내는 트랜잭션 5개
          const transferfromData2 = await contract.methods.transferFrom(req.session.user.address, followingUserInfo.address, 5).encodeABI();
          const transferRawTransaction2 = { 'to': erc20, 'gas': 100000, "data": transferfromData2 };
          const transferSignTx2 = await web3.eth.accounts.signTransaction(transferRawTransaction2, serverPKey);
          const transferSendSignTx2 = await web3.eth.sendSignedTransaction(transferSignTx2.rawTransaction);

          if (approveSendSignTx && transferSendSignTx && transferSendSignTx2) {
            //트랜잭션 발생 후 서버토큰양과, 클라이언트 토큰 양 
            const server_eth = await getBalance(serverAddress);
            const serverBalanceResult = await contract.methods.balanceOf(serverAddress).call();
            const followerUserBalanceResult = await contract.methods.balanceOf(req.session.user.address).call();
            const followingUserBalanceResult = await contract.methods.balanceOf(followingUserInfo.address).call();

            await Server.update({
                eth_amount: server_eth,
                token_amount: serverBalanceResult
              }, { where: { address: serverAddress } });
            
            //팔로우 한 사람 토큰 갯수 업데이트 
            await User.update({
                token_amount: followerUserBalanceResult
            }, { where: { nickname: req.session.user.nickname } });
            
            //팔로우 받은 사람 토큰 갯수 업데이트 
            await User.update({
                token_amount: followingUserBalanceResult
            }, { where: { nickname: following} });
            
            
        }

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

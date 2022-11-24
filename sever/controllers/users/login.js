const { User, Server, Token_price } = require("../../models");
const bcrypt = require("bcrypt");
const { web3, abi20, serverPKey, getBalance } = require("../../contract/Web3");
module.exports = {
  // 로그인
  post: async (req, res) => {
    const { email, password } = req.body;
    const now = Date.now();

    console.log(`입력 받은 email: ${email}, password: ${password}`);

    try {
      const user = await User.findOne({
        where: { email: email },
      });
      if (user) {
        //TODO: 로그인시 비크립트로 비밀번호 비교하기(v)
        const comparePassword = bcrypt.compareSync(password, user.password);
        console.log("해시 비교한 결과", comparePassword);

        if (user && comparePassword) {
          delete user.dataValues.password;
          req.session.user = user.dataValues;
          //TODO: 24시간 뒤에 로그인 하면 사용자 토큰 보상
          //TODO:  web3 연결
          //로그인 처음 아닐 때,
          if (!(parseInt(user.login_at) === 0)) {
            //24시간 지나면,
            if (now - parseInt(user.dataValues.login_at) >= 86400000) {
              const { login } = await Token_price.findOne({
                where: { id: 1 },
                attributes: ["login"],
                raw: true,
              });

              const serverInfo = await Server.findOne({
                attributes: ["address", "erc20"],
                raw: true,
              });

              const { address, erc20 } = serverInfo;

              console.log("서버 주소 :", address);
              console.log("erc20 서버 주소 :", erc20);
              console.log("유저 지갑 :", user.address);

              const contract = await new web3.eth.Contract(abi20, erc20);

              const data = contract.methods
                .transfer(user.address, login)
                .encodeABI();
              const rawTransaction = { to: erc20, gas: 100000, data: data };
              const signTx = await web3.eth.accounts.signTransaction(
                rawTransaction,
                serverPKey
              );
              const sendSignTx = await web3.eth.sendSignedTransaction(
                signTx.rawTransaction
              );

              if (sendSignTx) {
                const server_eth = await getBalance(address);
                //트랜잭션 보내고 서버 주소에서 남은 이더

                const serverBalance = await contract.methods
                  .balanceOf(address)
                  .call();
                //서버가 보유중인 토큰 양

                const clientBalance = await contract.methods
                  .balanceOf(user.address)
                  .call();
                //유저가 보유 중인 토큰 양

                await Server.update(
                  { eth_amount: server_eth, token_amount: serverBalance },
                  { where: { address: address } }
                );

                await User.update(
                  { token_amount: clientBalance, login_at: now },
                  { where: { email: email } }
                );

                return res.status(200).json({
                  message: "로그인이 완료되었습니다.( 1 토큰을 받았습니다! )",
                  data: {
                    id: user.dataValues.id,
                    address: user.dataValues.address,
                    profile_img: user.dataValues.profile_img,
                    email: user.dataValues.email,
                    nickname: user.dataValues.nickname,
                    phone_number: user.dataValues.phone_number,
                    sns_url: user.dataValues.sns_url,
                    height: user.dataValues.height,
                    weight: user.dataValues.weight,
                    gender: user.dataValues.gender,
                    token_amount: user.dataValues.token_amount,
                    follow_amount: user.dataValues.followers_num,
                  },
                });
              }
            } else {
              //24시간 전에 로그인하면 시간 업데이트 X
              return res.status(200).json({
                message: "로그인이 완료되었습니다.",
                data: {
                  id: user.dataValues.id,
                  address: user.dataValues.address,
                  profile_img: user.dataValues.profile_img,
                  email: user.dataValues.email,
                  nickname: user.dataValues.nickname,
                  phone_number: user.dataValues.phone_number,
                  sns_url: user.dataValues.sns_url,
                  height: user.dataValues.height,
                  weight: user.dataValues.weight,
                  gender: user.dataValues.gender,
                  token_amount: user.dataValues.token_amount,
                  follow_amount: user.dataValues.followers_num,
                },
              });
            }
          } else {
            //첫로그인
            await User.update({ login_at: now }, { where: { email: email } });
            return res.status(200).json({
              message: "환영합니다! 로그인이 완료되었습니다.",
              data: {
                id: user.dataValues.id,
                address: user.dataValues.address,
                profile_img: user.dataValues.profile_img,
                email: user.dataValues.email,
                nickname: user.dataValues.nickname,
                phone_number: user.dataValues.phone_number,
                sns_url: user.dataValues.sns_url,
                height: user.dataValues.height,
                weight: user.dataValues.weight,
                gender: user.dataValues.gender,
                token_amount: user.dataValues.token_amount,
                follow_amount: user.dataValues.followers_num,
              },
            });
          }
        } else {
          return res.status(404).json({
            message: "이메일 혹은 비밀번호가 틀렸습니다.",
          });
        }
      } else {
        return res.status(404).json({
          message: "존재하지 않는 이메일 입니다.",
        });
      }
    } catch (e) {
      console.log("sequelize Err");
      console.log(e);
    }
  },
};

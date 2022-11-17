const { User } = require("../../models");
const Server = require('../../models/server');
const { getAddress,web3,abi20,serverPKey,getBalance } = require("../../contract/Web3");
const bcrypt = require("bcrypt");
const { findOne } = require("../../models/server");
const SALT_ROUNDS = process.env.SALT_ROUNDS;

module.exports = {
  //회원 가입
  post: async (req, res) => {
    try {
      console.log(req.file);
      const { host } = req.headers;
      const profile_img = req.file.path;
      let {email,password,nickname,phone_number,height,weight,gender,sns_url,} = req.body;

      console.log(
        `입력 받은 email: ${email}, password: ${password}, nickname: ${nickname}, phone_number: ${phone_number}, height: ${height}, weight: ${weight}, gender: ${gender}, sns_url ${sns_url}`
      );
      //비크립트로 passsword 해시화

      //사용자의 어드레스 
      const address = await getAddress(password);

      const salt = bcrypt.genSaltSync(parseInt(SALT_ROUNDS));
      const hash = bcrypt.hashSync(password, salt);

      console.log(hash, "해시화 ");

      //서버의 지갑 주소 
      const server_Accounts = await web3.eth.getAccounts();
      try {
        
        //회원가입하면 5토큰 주기
      //서버의 정보 가져오기
        const serverInfo = await Server.findOne({
          attributes: ['address', 'erc20'],
          where:{address: server_Accounts[0]}
        });
  
        const serverAddress = serverInfo.dataValues.address;
        const erc20 = serverInfo.dataValues.erc20;
  
        const contract = await new web3.eth.Contract(abi20, erc20);
        const data = contract.methods.transfer(address, 5).encodeABI(); //5토큰 주기
        const rawTransaction = { 'to': erc20, 'gas': '100000', 'data': data }; //트랜잭션 서버 erc20주소에 전달
        const signTx = await web3.eth.accounts.signTransaction(rawTransaction, serverPKey);
  
        const sendSignTx = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
  
        if (sendSignTx) {
          const server_eth = await getBalance(serverAddress);
          //트랜잭션 보내고 서버 주소에서 남은 이더 
          console.log(server_eth,'트랜잭션 후 서버 남은이더 ');
  
          const serverBalance = await contract.methods.balanceOf(serverAddress).call();
          //서버가 보유중인 토큰 양 
          console.log(serverBalance,'트랜잭션 후 서버 남은토큰 ');
          const clientBalance = await contract.methods.balanceOf(address).call();
          //유저가 보유 중인 토큰 양
          console.log(clientBalance,'트랜잭션 후 유저 토큰 ');
  
          await Server.update({
            eth_amount: server_eth,
            token_amount: serverBalance
          }, { where: {address: serverAddress } });
          
          
          await User.create({
            nickname: nickname,
            address: address,
            profile_img: `http://${host}/${profile_img}`,
            email: email,
            password: hash,
            phone_number: phone_number,
            height: height,
            weight: weight,
            gender: gender,
            sns_url: sns_url,
            token_amount: clientBalance,
          });
  
          res.status(200).json({
            message: "회원가입이 완료 되었습니다.",
          });
        }

      } catch (e) {
        console.log("sequelize 에러");
        console.log(e);
      }
    } catch (e) {
      console.log("multer 에러");
      console.log(e);
    }
  },
};

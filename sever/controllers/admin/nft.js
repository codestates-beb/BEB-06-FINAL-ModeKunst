const { User, Server, Token,Token_price } = require("../../models");
const { web3, abi721,abi20, getBalance, serverPKey} = require("../../contract/Web3");

module.exports = {
  nftmint: async (req, res) => {
    const { host } = req.headers;

    //상위 10명 (팔로워수 많은 사람)

    const { title, metadataUrl, description } = req.body;


    const contractServer = await Server.findOne({
      attributes: ["erc721", "erc20","address"],
      raw: true,
    });
    const celebrity = await User.findAll({
      limit: 10,
      order: [["followers_num", "DESC"]],
      attributes: ["nickname","address"],
    });

    //token_price
    const erc20_price = await Token_price.findOne({
      where:{id:1},
      attributes:['get_nft'],
      raw :true,
    });

    const getNftPrice = erc20_price.get_nft;


    if(celebrity.length >=1){
      const { address, erc721 ,erc20} = contractServer;

      console.log(address,erc20,erc721,'엌엌')

      const contract721 = await new web3.eth.Contract(abi721, erc721);
      const contract20 = await new web3.eth.Contract(abi20, erc20);
      const mintBefore_amount = await contract721.methods.totalSupply().call();
      // console.log(mintBefore_amount,"민팅 전 ");

      //nft 상위 10명은
      celebrity.map(async (el,idx) => {


        //erc20 토큰 10개 발급
        const data = contract20.methods.transfer(el.dataValues.address, getNftPrice).send({
          from: address, gas:100000});


        //민팅할 때 , 상위 10 명 메타데이터에 담아서 민팅
        //메타 데이터에 민팅 하면서 넣기
        const mintNft = await contract721.methods
            .mintNFT(el.dataValues.address, metadataUrl)
            .send({ from: address, gas: 1321250 });

        const clientBalance = await contract20.methods.balanceOf(el.dataValues.address).call();
        //유저가 보유 중인 토큰 양

        await User.update(
            { token_amount: clientBalance },
            { where: { nickname: el.dataValues.nickname } }
        );

        await Token.create({
          title: title,
          description: description,
          tx_hash: mintNft.transactionHash,
          token_url: metadataUrl,
          UserNickname: el.dataValues.nickname,
          image: `http://${host}/${req.file.path}`,
          tokenid: Number(mintBefore_amount)+idx+1,
        });
      });
      const server_eth = await getBalance(address);
      //토큰 컨트랙트 발행 후 서버 eth nft amount 업데이트
      const mintAfter_amount = await contract721.methods.totalSupply().call();
      // console.log(mintAfter_amount,"민팅 후 ");

      const serverBalance = await contract20.methods.balanceOf(address).call();
      //서버가 보유중인 토큰 양

      // console.log(await contract721.methods.tokenURI("63").call(),"토큰 데이터");
      // console.log(await contract721.methods.ownerOf("63").call(),"주인")
      await Server.update(
          { eth_amount: server_eth, nft_amount: mintAfter_amount, token_amount: serverBalance},
          {where:{address: address}}
      )


      return res.status(200).json({
        message: `${title} 시즌 토큰 발급을 완료 했습니다.`,
      });
    }

    else{

      return res.status(404).json({message:"사용자가 없습니다!"});
    }



  },

  nftlist : async(req,res)=>{
    try{
      const nftList = await Token.findAll({
        attributes:["title","image","description","token_rul"],
      });

      console.log(nftList,"nfts 내용");

      const nfts = nftList.map((el,idx)=>{
        return {
          title: el.dataValues.title,
          image: el.dataValues.image,
          description: el.dataValues.description,
          token_url: el.dataValues.token_url

        }
      })

      return res.status(200).json({nfts});

    }catch(err){
      return res.status(404).json({message:"error"});
    }




  }
};

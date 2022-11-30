const {User,Server,Token } =require('../../models');
const { web3,abi721} = require('../../contract/Web3');



module.exports={
    nftmint: async(req,res) =>{

        console.log(req.file);
        const {host} = req.headers;

        //상위 10명 (팔로워수 많은 사람)


        const {title, description} = req.body;

        const contractServer = await Server.findOne({
            attributes:["erc721","address"],
            raw:true
        });
        const celebrity = await User.findAll({
            limit:10,
            order:[["followers_num","DESC"]],
            attributes:["nickname"]
        });



        const celebList = [];
        celebrity.map((el)=>{
            celebList.push(el.dataValues.nickname);
        })

        const celebData = {
            celeb: celebList
        }

        const {address, erc721} = contractServer;



        const contract721 = await new web3.eth.Contract(abi721,erc721);

        //민팅할 때 , 상위 10 명 메타데이터에 담아서 민팅
        //메타 데이터에 민팅 하면서 넣기
        const mintNft = await contract721.methods.mintNFT(address,JSON.stringify(celebData)).send({from:address, gas:1321250});
        const mint_amount = await contract721.methods.totalSupply().call();
        const tokenUrI = await contract721.methods.tokenURI(mint_amount).call();
        console.log(tokenUrI,'엌엌');

        //nft 상위 10명은
        celebList.map(async (el)=>{
            await Token.create({
                title:title,
                description:description,
                tx_hash : mintNft.transactionHash,
                token_url: data.url,
                UserNickname:el,
                image: `http://${host}/${req.file.path}`,

            });
        })


        return res.status(200).json({
            message:`${title} 시즌 토큰 발급을 완료 했습니다.`,
            nft_amount: mint_amount});


    },


}
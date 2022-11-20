const { User, Server } = require('../../models');
const { web3, abi20 } = require('../../contract/Web3');

module.exports = {

    // 보유 토큰 양
    get: async (req, res) => {
        const { nickname } = req.params;

        const user = await User.findOne({
           where: { nickname: nickname }
        });

        // 방법 1. user db에 있는 정보를 빼온다.
        //const { address, token_amount } = user.dataValues;


        // 방법 2. user db에서 EOA만 빼오고 그 EOA로 web3 연결해서 토큰 양 구한다.

        const address = user.dataValues.address;

        const erc20CA = await Server.findOne({
            attributes: ['erc20', 'erc20_name', 'erc20_symbol', 'erc20_img']
        });

        const { erc20, erc20_name, erc20_symbol, erc20_img } = erc20CA.dataValues;

        const contract = await new web3.eth.Contract(abi20, erc20);

        const tokens = await contract.methods.balanceOf(address).call();

        res.status(200).json({
            message: `${nickname}님의 보유 토큰양`,
            data: {
                address: address,
                token_amount: tokens,
                token_name: erc20_name,
                token_symbol: erc20_symbol,
                token_img: erc20_img
            }
        });

    }
}
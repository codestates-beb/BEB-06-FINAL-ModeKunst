const { User, Server } = require('../../models');
const { web3, abi20, serverPKey, getBalance} = require('../../contract/Web3');

module.exports = {

    // 보유 토큰 양
    get: async (req, res) => {
        const { nickname } = req.params;

        const user = await User.findOne({
            where: { nickname: nickname },
            attributes: ['point_amount', 'address'],
            raw: true
        });

        // 방법 2. 이건 나중에 수정
        const { address, point_amount }= user;

        const erc20CA = await Server.findOne({
            attributes: ['erc20', 'erc20_name', 'erc20_symbol', 'erc20_img']
        });

        const { erc20, erc20_name, erc20_symbol, erc20_img } = erc20CA.dataValues;

        const contract = await new web3.eth.Contract(abi20, erc20);

        const tokens = await contract.methods.balanceOf(address).call();

        res.status(200).json({
            message: `${nickname}님의 보유 토큰양`,
            data: {
                address,
                point_amount,
                token_amount: tokens,
                token_name: erc20_name,
                token_symbol: erc20_symbol,
                token_img: erc20_img
            }
        });

    },

    transfer: async  (req, res) => {
        const nickname = req.session.user?.nickname;
        const { point } = req.body;

        try{
            let { point_amount, address } = await User.findOne({
                where: { nickname: nickname },
                attributes: ['point_amount', 'address'],
                raw: true
            });

            if(!(point > point_amount)){
                point_amount = point_amount - point;
                let token = Math.floor(point / 10);
                console.log(token);
                const server_info = await Server.findOne({
                    attributes: ['erc20', 'address'],
                    raw: true
                });

                const server_address = server_info.address;
                const erc20 = server_info.erc20;
                try{
                    const contract = await new web3.eth.Contract(abi20, erc20);

                    console.log(await contract.methods.balanceOf(server_address).call())

                    const transferData = contract.methods.transfer(address, token).encodeABI();
                    const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferData };
                    const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
                    await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);

                    const server_eth = await getBalance(server_address);

                    const serverBalance = await contract.methods.balanceOf(server_address).call();
                    console.log(serverBalance)
                    const clientBalance = await contract.methods.balanceOf(address).call();

                    await User.decrement({ point_amount: point }, { where: { nickname: nickname } });

                    await User.update({ token_amount: clientBalance }, {
                        where: { nickname: nickname }
                    });

                    await Server.update({
                        eth_amount: server_eth,
                        token_amount: serverBalance
                    }, { where: { address: server_address } });

                    res.status(200).json({
                       message: `${token}개로 전환 하였습니다.`,
                       data: {
                           token_amount: clientBalance,
                           point_amount: point_amount
                       }
                    });

                } catch (e) {
                    console.log('transfer Err');
                    console.log(e);
                }
            }else{
                res.status(401).json({
                    message: '보유 포인트가 부족합니다.'
                })
            }
        } catch (e) {
            console.log('sequelize Err')
        }


    }
}
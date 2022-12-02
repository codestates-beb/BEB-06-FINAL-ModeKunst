const { Post, User, Server, Token_price} = require('../../models');
const { web3, serverPKey, abi20, getBalance} = require("../../contract/Web3");

module.exports = {

    // 상단 게시물 추가
    post: async (req, res) => {
        const { id } = req.body;
        const userSession = req.session.user
        const nickname = userSession.nickname;
        if(nickname){
            try {
                const { top_post } = await Post.findOne({
                    attributes: ['top_post'],
                    where: { id: id },
                    raw: true
                });
                if(!top_post){
                    try {
                        const { point_amount } = await User.findOne({ where: { nickname: nickname }, attributes: ['point_amount'], raw: true});

                        const price = await Token_price.findOne({ where: { id: 1 }, attributes: ['top_post'], raw: true });
                        const top_post_price = price.top_post;

                        if(point_amount >= top_post_price){


                            const serverInfo = await Server.findOne({ attributes: ['address', 'erc20'], raw: true });
                            const { address  } = serverInfo;

                            await User.decrement({ point_amount: top_post_price } , { where: { nickname: nickname }});

                            await Server.increment({ used_point: top_post_price }, { where: { address: address } });

                            await Post.update({ top_post: true }, { where: { id: id } });

                            res.status(200).json({
                                message: '상단 게시물에 추가 되었습니다.'
                            })
                        }else{
                            res.status(401).json({
                                message: '토큰이 부족합니다.'
                            })
                        }
                    } catch (e) {
                        console.log('sequelize Err');
                        console.log(e);
                    }
                }else{
                    res.status(401).json({
                        message: '이미 상단 게시물 입니다.'
                    })
                }
            } catch (e) {
                console.log('sequelize Err');
                console.log(e);
            }
        }else{
            res.status(401).json({
                message: '로그인 이후 이용해주세요.'
            })
        }
    }
}
const { Post, Like, Product_brand, Product_size, Product_name, Server ,User, Follow} = require('../../models');
const { literal } = require("sequelize");
const { web3, abi20, serverPKey, getBalance } = require('../../contract/Web3');

module.exports = {

    // 좋아요
    like: async (req, res) => {
        //로그인한 사용자
        const nickname = req.session.user?.nickname;
        const { postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);
        

        if(nickname){
            try {
                const like = await Like.findOne({
                    where: { UserNickname: nickname, PostId: postId },
                    paranoid: false
                });

                if(!like){
                    // 첫 좋아요
                    try {
                        // const post = await Post.findOne({
                        //     where: { id: postId },
                        //     include: [{model: Product_brand, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_name, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_size, attributes: ['outer', 'top', 'pants', 'shoes']}, ],
                        //     attributes: ['user_price', 'UserNickname']
                        // });

                        const post = await Post.findOne({
                            where: { id: postId },
                            attributes: ['server_price', 'user_price', 'UserNickname'],
                            raw: true
                        });

                        const { server_price, user_price, UserNickname } = post;

                        const isFollow = await Follow.findOne({
                            where: { follower: nickname, following: UserNickname },
                            paranoid: false
                        });

                        const total_price = server_price + user_price;
                        if(isFollow){
                            await Like.create({ UserNickname: nickname, PostId: postId });

                            const likes = await Like.count({
                                where: { PostId: postId }
                            });

                            await Post.update( { likes_num: likes}, { where: {id: postId} });

                            res.status(200).json({
                                message: '게시물을 좋아요 했습니다.',
                                data: {
                                    likes: likes,
                                    isLike: true,
                                }
                            });
                        }else{
                            if(UserNickname === nickname ){
                                await Like.create({ UserNickname: nickname, PostId: postId });

                                const likes = await Like.count({
                                    where: { PostId: postId }
                                });

                                await Post.update( { likes_num: likes}, { where: {id: postId} });

                                res.status(200).json({
                                    message: '게시물을 좋아요 했습니다.',
                                    data: {
                                        likes: likes,
                                        isLike: true,
                                    }
                                });
                            }else{
                                const user = await User.findOne({
                                    where: { nickname: nickname },
                                    raw: true
                                });

                                const { token_amount } = user;

                                if(total_price <= token_amount){
                                    const serverInfo = await Server.findOne({
                                        attributes: ['address', 'erc20'],
                                        raw: true
                                    });
                                    const { address, erc20 } = serverInfo;

                                    const contract = await new web3.eth.Contract(abi20, erc20);

                                    const writer = await User.findOne({ where: { nickname: UserNickname }, attributes: ['address'], raw: true }); //작성자


                                    try{
                                        const ApproveData = contract.methods.approve(req.session.user.address, total_price).encodeABI();
                                        const approveRawTransaction = { 'to': erc20, 'gas': 100000, "data": ApproveData };
                                        const approveSignTx = await web3.eth.accounts.signTransaction(approveRawTransaction, serverPKey);
                                        await web3.eth.sendSignedTransaction(approveSignTx.rawTransaction);

                                        if(user_price){
                                            try{
                                                const transferfromData = contract.methods.transferFrom(req.session.user.address, address, server_price).encodeABI();
                                                const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferfromData };
                                                const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
                                                await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);

                                                //유저에게 보내는 트랜잭션
                                                const transferfromData2 = contract.methods.transferFrom(req.session.user.address, writer.address, user_price).encodeABI();
                                                const transferRawTransaction2 = { 'to': erc20, 'gas': 100000, "data": transferfromData2 };
                                                const transferSignTx2 = await web3.eth.accounts.signTransaction(transferRawTransaction2, serverPKey);
                                                await web3.eth.sendSignedTransaction(transferSignTx2.rawTransaction);
                                            }catch (e) {
                                                console.log('Server and User');
                                            }
                                        }else{
                                            try {
                                                const transferfromData = contract.methods.transferFrom(req.session.user.address, address, server_price).encodeABI();
                                                const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferfromData };
                                                const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
                                                await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);
                                            } catch (e){
                                                console.log('only Sever ')
                                            }

                                        }
                                        try{
                                            const server_eth = await getBalance(address);
                                            const serverBalanceResult = await contract.methods.balanceOf(address).call();
                                            const clientBalanceResult = await contract.methods.balanceOf(req.session.user.address).call();
                                            const writerBalanceResult = await contract.methods.balanceOf(writer.address).call();

                                            await Server.update({
                                                eth_amount: server_eth,
                                                token_amount: serverBalanceResult
                                            }, { where: { address: address } });

                                            //좋아요 한 사람 토큰 갯수 업데이트
                                            await User.update({
                                                token_amount: clientBalanceResult
                                            }, { where: { nickname: req.session.user.nickname } });

                                            //좋아요 받은 사람 토큰 갯수 업데이트 (작성자)
                                            await User.update({
                                                token_amount: writerBalanceResult
                                            }, { where: { nickname: UserNickname } });

                                            await Like.create(
                                                { UserNickname: nickname, PostId: postId }
                                            );

                                            const likes = await Like.count({
                                                where: { PostId: postId }
                                            });

                                            await Post.update( { likes_num: likes}, { where: {id: postId} });

                                            res.status(200).json({
                                                message: '게시물을 좋아요 했습니다.',
                                                data: {
                                                    likes: likes,
                                                    isLike: true,
                                                }
                                            });

                                        }catch (e) {
                                            console.log('sequelize Err')
                                        }

                                    }catch (e) {
                                        console.log('approve Err');
                                    }
                                }else{
                                    return res.status(400).json({ message: "토큰의 갯수가 부족합니다." });
                                }
                            }
                        }
                    } catch (e) {
                        console.log('sequelize Err');
                        console.log(e);
                    }
                }else {
                    // 좋아요 취소 했다가 다시 좋아요
                    if(like?.dataValues.deletedAt){
                        try {
                            await Like.destroy({
                                where: { UserNickname: nickname, PostId: postId },
                                force: true
                            });

                            await Like.create(
                                { UserNickname: nickname, PostId: postId }
                            );

                            const likes = await Like.count({
                                where: { PostId: postId }
                            });

                            await Post.update( { likes_num: likes}, { where: {id: postId} });

                            res.status(200).json({
                                message: '게시물을 좋아요 했습니다.',
                                data: {
                                    likes: likes,
                                    isLike: true,
                                }
                            });
                        } catch (e) {
                            console.log('sequelize Err');
                            console.log(e);
                        }
                    }else{
                        res.status(401).json({
                            message: '이미 좋아요를 했습니다.'
                        })
                    }
                }

            } catch (e) {
                console.log('sequelize Err');
                console.log(e);
            }
        } else{
            res.status(401).json({
                message: '로그인 후 이용 가능합니다.'
            })
        }
    },

    // 좋아요 취소
    unlike: async (req, res) => {
        const nickname = req.session?.user.nickname;
        const { postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);

        try {
            await Like.destroy({
                where: { UserNickname: nickname, PostId: postId }
            })

            const likes = await Like.count({
                where: { PostId: postId }
            });

            await Post.update( { likes_num: likes}, { where: {id: postId} });

            res.status(200).json({
                message: '게시물을 좋아요 취소했습니다.',
                data: {
                    likes: likes,
                    isLike: false,
                }
            })
        } catch (e) {
            console.log('sequelize Err');
            console.log(e);
        }
    }
}
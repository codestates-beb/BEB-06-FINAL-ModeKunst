const { Post, Like, Product_brand, Product_size, Product_name,Server,User } = require('../../models');
const { literal } = require("sequelize");
const { web3, abi20, serverPKey, getBalance } = require('../../contract/Web3');

module.exports = {

    // 좋아요
    like: async (req, res) => {
        //로그인한 사용자 : 좋아요 누를 사람 ??
        const login_user = req.session.user?.nickname;
        //nickname 파라미터 : 게시물을 작성한 작성자 (좋아요 받을 사람)??
        const { nickname, postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);
        
        const server_Accounts = await web3.eth.getAccounts();
        const serverInfo = await Server.findOne({
                attributes: ['address', 'erc20'],
                where: { address: server_Accounts[0] }
                });
        const serverAddress = serverInfo.dataValues.address;
        const erc20 = serverInfo.dataValues.erc20;
        const contract = await new web3.eth.Contract(abi20, erc20);
        const writer = await User.findOne({ where: { nickname: nickname } }); //작성자 ??

        if(login_user){
            try {
                const like = await Like.findOne({
                    where: { UserNickname: nickname, PostId: postId },
                    paranoid: false
                });
                console.log("좋아요 게시물 :", like);

                if (!like) {
                    
                    if(!(login_user === nickname)){
                        // 첫 좋아요
                        try {
                            const post = await Post.findOne({
                                where: { id: postId },
                                include: [{model: Product_brand, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_name, attributes: ['outer', 'top', 'pants', 'shoes']}, { model: Product_size, attributes: ['outer', 'top', 'pants', 'shoes']}, ],
                                attributes: ['price']
                            });
                            console.log(post.dataValues.price);

                            //TODO server가 가져가는 토큰양, user에게 주는 토큰양 따로 저장?
                            // if(post.dataValues.Product_size){
                            //
                            // }else{
                            //
                            // }
                            const ApproveData = await contract.methods.approve(req.session.user.address, 20).encodeABI();
                            const approveRawTransaction = { 'to': erc20, 'gas': 100000, "data": ApproveData };
                            const approveSignTx = await web3.eth.accounts.signTransaction(approveRawTransaction, serverPKey);
                            const approveSendSignTx = await web3.eth.sendSignedTransaction(approveSignTx.rawTransaction); 
                            //보내기전 좋아요누르는 사람 토큰 갯수(2개 이상은 있어야함)
                            const clientBalanceBefore = await contract.methods.balanceOf(req.session.user.address).call();
                            //토큰 갯수 2개 이상 
                            if (clientBalanceBefore >= 2) {
                                //서버에게 보내는 양 1개 좋아요 한 유저에게 보내는 양 1개 
                                const transferfromData = await contract.methods.transferFrom(req.session.user.address, serverAddress, 1).encodeABI();
                                const transferRawTransaction = { 'to': erc20, 'gas': 100000, "data": transferfromData };
                                const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction, serverPKey);
                                const transferSendSignTx = await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);
                                
                                //유저에게 보내는 트랜잭션
                                const transferfromData2 = await contract.methods.transferFrom(req.session.user.address, writer.address, 1).encodeABI();
                                const transferRawTransaction2 = { 'to': erc20, 'gas': 100000, "data": transferfromData2 };
                                const transferSignTx2 = await web3.eth.accounts.signTransaction(transferRawTransaction2, serverPKey);
                                const transferSendSignTx2 = await web3.eth.sendSignedTransaction(transferSignTx2.rawTransaction);
                                    
                                if (approveSendSignTx && transferSendSignTx && transferSendSignTx2) {
                                    //트랜잭션 발생 후 서버토큰양과, 클라이언트 토큰 양 
                                    const server_eth = await getBalance(serverAddress);
                                    const serverBalanceResult = await contract.methods.balanceOf(serverAddress).call();
                                    const clientBalanceResult = await contract.methods.balanceOf(req.session.user.address).call();
                                    const writerBalanceResult = await contract.methods.balanceOf(writer.address).call();
                
                                    await Server.update({
                                        eth_amount: server_eth,
                                        token_amount: serverBalanceResult
                                      }, { where: { address: serverAddress } });
                                    
                                    //좋아요 한 사람 토큰 갯수 업데이트 
                                    await User.update({
                                        token_amount: clientBalanceResult
                                    }, { where: { nickname: req.session.user.nickname } });
                                    
                                    //좋아요 받은 사람 토큰 갯수 업데이트
                                    await User.update({
                                        token_amount: writerBalanceResult
                                    }, { where: { nickname: nickname } });
                                    
                                    
                                }
                            } else {
                                return res.status(400).json({ message: "토큰의 갯수가 부족합니다. 좋아요를 할 수 없습니다." });
                             }
                           
                                
                                

                            await Like.create({ UserNickname: login_user, PostId: postId });

                            const likes = await Like.count({
                                where: { PostId: postId }
                            });

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
                        

                        await Like.create(
                            { UserNickname: login_user, PostId: postId }
                        );

                        const likes = await Like.count({
                            where: { PostId: postId }
                        });

                        res.status(200).json({
                            message: '게시물을 좋아요 했습니다.',
                            data: {
                                likes: likes,
                                isLike: true,
                            }
                        });
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
        const { nickname, postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);

        try {
            await Like.destroy({
                where: { UserNickname: nickname, PostId: postId }
            })

            const likes = await Like.count({
                where: { PostId: postId }
            });

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
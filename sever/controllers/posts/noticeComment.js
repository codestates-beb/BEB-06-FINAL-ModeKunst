const {Notice, User, Server, Comment} = require('../../models');
const {web3, abi20, serverPKey, getBalance} = require('../../contract/Web3');

module.exports = {
    //래플 댓글 작성 토큰 갯수 만큼 차감
    post: async (req, res) => {
        // 토큰 갯수만큼 사용자의 토큰 차감
        let user = req.session.user.nickname; //로그인한 사용자
        let {noticeId} = req.params; // 해당 공지에 대한 Id 값
        let {content} = req.body;

        //noticeId에 대한 notice 공지 데이터 불러오기 (토큰 양)
        let token_price = await Notice.findOne({
            where: {id: noticeId}, attributes: ['token_price'],

        });



        //사용자의 토큰양
        const user_token_amount = await User.findOne({
            where: {nickname: user},
            attributes: ['token_amount']
        });


        const noticeExist = await Comment.findOne({
            where:{ UserNickname : req.session.user.nickname}
        });



        try{
            //사용자의 토큰 양이 부족할 때,
            if (user_token_amount.dataValues.token_amount < token_price.dataValues.token_price) {
                return res.status(404).json({
                    message: "보유 토큰 양이 부족합니다."
                })
            }
            //토큰 양이 충분할 때
            if (user_token_amount.dataValues.token_amount >= token_price.dataValues.token_price) {
                if(noticeExist){
                    return res.status(404).json({message:"래플 댓글은 한번만 달 수 있습니다"});

                }


                //서버의 정보
                const serverInfo = await Server.findOne({
                    attributes: ['address', 'erc20'],
                    raw: true,
                });
                const { address, erc20} = serverInfo;
                const contract = await new web3.eth.Contract(abi20, erc20);



                //댓글 작성자가
                const approveData = contract.methods.approve(req.session.user.address, token_price.dataValues.token_price).encodeABI();
                console.log(approveData);
                const approveRawTransaction = { 'to': erc20, 'gas': 100000, 'data': approveData };
                const approveSignTx = await web3.eth.accounts.signTransaction(approveRawTransaction,serverPKey);
                const approveSendSignTx = await web3.eth.sendSignedTransaction(approveSignTx.rawTransaction);

                console.log('사용자 토큰 갯수 : ', await contract.methods.balanceOf(req.session.user.address).call());

                //서버에게 토큰 보내기
                const transferfromData = contract.methods.transferFrom(req.session.user.address, address, token_price.dataValues.token_price).encodeABI();
                const transferRawTransaction = {'to':erc20, 'gas':100000,'data':transferfromData};
                const transferSignTx = await web3.eth.accounts.signTransaction(transferRawTransaction,serverPKey);
                const transferSendSignTx = await web3.eth.sendSignedTransaction(transferSignTx.rawTransaction);


                //트랜잭션 발생 후 서버 토큰양과 클라이언트 토큰양

                const serverBalanceResult = await contract.methods.balanceOf(address).call();
                const userBalanceResult = await  contract.methods.balanceOf(req.session.user.address).call();

                await Server.update({
                    token_amount: serverBalanceResult
                },{where:{address:address}});

                await User.update({
                    token_amount: userBalanceResult
                }, {where:{nickname: user}});

                await Comment.create({
                    content:content,
                    UserNickname:user,
                    NoticeId:noticeId,
                });

                return res.status(200).json({message:`래플 신청이 완료되었습니다.(${token_price.dataValues.token_price}토큰 소모)`});


            }

        }catch(err){
            console.log(err);
        }
    },

    //댓글들 불러오기
    get: async(req,res)=>{
        const {noticeId} = req.params;

        try{}catch(err){
            console.log(err);
        }
        const raffle_commentList = await Comment.findAll({
            attributes:['UserNickname','content','createdAt'],
            where:{Noticeid:noticeId}
        });

        console.log(raffle_commentList);

        const comments = raffle_commentList.map((el)=>{
            return{
                user_nickname: el.dataValues.UserNickname,
                content: el.dataValues.content,
                createAt: el.dataValues.createdAt,
            }
        })

        return res.status(200).json({
                comments
        })


    },

    put: async(req,res)=>{
        const {noticeId} = req.params;
        let { content} = req.body;

        try{
            const userExist = await Comment.findOne({
                where:{UserNickname:req.session.user.nickname}
            });

            if(userExist){
                await Comment.update({
                        content: content,
                    }, {where:{UserNickname:req.session.user.nickname}}
                );


                return res.status(200).json({
                    message:"래플 신청댓글이 수정 되었습니다."
                })
            }
            if(!userExist){
                return res.status(404).json({
                    message:"사용자가 남긴 댓글이 없습니다."
                })
            }




        }catch(err){
            console.log(err);
        }



    }

}
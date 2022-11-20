const { Post, Like, Product_brand, Product_size, Product_name } = require('../../models');
const {literal} = require("sequelize");

module.exports = {

    // 좋아요
    like: async (req, res) => {
        const login_user = req.session.user?.nickname;
        const { nickname, postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);
        if(login_user){
            try {
                const like = await Like.findOne({
                    where: { UserNickname: nickname, PostId: postId },
                    paranoid: false
                });

                if(!like){
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
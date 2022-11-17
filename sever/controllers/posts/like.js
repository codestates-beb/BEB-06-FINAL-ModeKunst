const { Post, Like, Product_brand, Product_size, Product_name } = require('../../models');
const {literal} = require("sequelize");

module.exports = {

    // 좋아요
    like: async (req, res) => {
        const { nickname, postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);

        try {
            const like = await Like.findOne({
                where: { UserNickname: nickname, PostId: postId },
                paranoid: false
            });

            if(!like){
                // 첫 좋아요
                try {
                    const { category } =  await Post.findOne({
                        where: { id: postId },
                        attributes: ['category'],
                        raw: true
                    });
                    const brand = await Product_brand.findOne({
                        where: { PostId: postId },
                        attributes: ['outer', 'top', 'pants', 'shoes'],
                        raw: true
                    });
                    const name = await Product_name.findOne({
                        where: { PostId: postId },
                        attributes: ['outer', 'top', 'pants', 'shoes'],
                        raw: true
                    });
                    const size = await Product_size.findOne({
                        where: { PostId: postId },
                        attributes: ['outer', 'top', 'pants', 'shoes'],
                        raw: true
                    });



                    await Like.create({ UserNickname: nickname, PostId: postId });

                    const likes = await Like.count({
                        where: { PostId: postId }
                    });

                    console.log(similarLook);
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
const { Review } = require('../../models');

module.exports = {

    // 리뷰 작성
    post: async (req, res) => {
        const { nickname, postId } = req.params;
        const { content } = req.body;
        console.log(`입력받은 nickname: ${nickname}, postId: ${postId}, content: ${content}`);
        try {
            const review = await Review.findOne({
                where: { UserNickname: nickname, PostId: postId},
                paranoid: false
            });

            if(!review){
                // 여기가 새 리뷰
                try{
                    await Review.create(
                        { content: content, UserNickname: nickname, PostId: postId },
                    );

                    res.status(200).json({
                        message: '리뷰가 작성되었습니다.'
                    })
                } catch (e) {
                    console.log(`sequelize Err`);
                    console.log(e);
                }
            }else{
                //여기가 리뷰 삭제 후 다시 작성
                if(review?.dataValues.deletedAt){
                    await Review.destroy({
                        where: { UserNickname: nickname, PostId: postId},
                        force: true
                    });

                    await Review.create(
                        { content: content, UserNickname: nickname, PostId: postId },
                    );

                    res.status(200).json({
                        message: '리뷰가 작성 되었습니다.'
                    })
                }else{
                    res.status(401).json({
                        message: '이미 리뷰를 작성했습니다.'
                    })
                }
            }
        } catch (e) {
            console.log(`sequelize Err`);
            console.log(e)
        }

    },

    // 리뷰 수정
    put: async (req, res) => {
        const { nickname, postId } = req.params;
        const { content } = req.body;

        try {
            await Review.update(
                { content: content},
                { where: { UserNickname: nickname, PostId: postId}}
            );

            res.status(200).json({
                message: '리뷰가 수정되었습니다.'
            })
        } catch (e) {
            console.log(`sequelize Err`);
            console.log(e)
        }
    },

    // 리뷰 삭제
    delete: async (req, res) => {
        const { nickname, postId } = req.params;
        const { content } = req.body;

        try {
            await Review.destroy({
                where: { UserNickname: nickname, PostId: postId }
            });

            res.status(200).json({
                message: '리뷰가 삭제되었습니다.'
            })

        } catch (e) {
            console.log(`sequelize Err`);
            console.log(e)
        }

    }
}
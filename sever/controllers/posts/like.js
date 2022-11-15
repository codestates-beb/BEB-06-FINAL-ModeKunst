const { Like } = require('../../models');

module.exports = {


    // 좋아요
    like: async (req, res) => {
        const { nickname, postId } = req.params;
        console.log(`입력받은 nickname: ${nickname} postId: ${postId}`);

        try {
            await Like.findOrCreate({
                where: { UserNickname: nickname, PostId: postId },
                defaults: { UserNickname: nickname, PostId: postId}
            })

            res.status(200).json({
                message: '게시물을 좋아요 했습니다.'
            })
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

            res.status(200).json({
                message: '게시물을 좋아요 취소했습니다.'
            })
        } catch (e) {
            console.log('sequelize Err');
            console.log(e);
        }
    }
}
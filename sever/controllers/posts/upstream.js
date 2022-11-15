const { Top_post } = require('../../models');

module.exports = {

    // 상단 게시물 추가
    post: async (req, res) => {
        const { id } = req.body;

        try {
            await Top_post.findOrCreate({
                where : { PostId : id },
                defaults: { PostId : id }
            });

            res.status(200).json({
               message: '상단 게시물에 등록 되었습니다.'
            });
        } catch (e) {
            console.log('sequelize Err');
            console.log(e);
        }

    }
}
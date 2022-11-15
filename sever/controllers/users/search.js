const { User, Post } = require('../../models');

module.exports = {

    // 검색
    get: async (req, res) => {
        const { nickname } = req.params;
        console.log(`입력받은 nickname: ${nickname}`);

        const user = await User.findOne({
            where: { nickname: nickname }
        });

        if(user) {
            const posts = await Post.findAll({
                where: {user_nickname: nickname}
            });

            // 반환 값 수정
            console.log(posts);
            if(posts.length) {
                res.status(200).json({

                });
            }else {
                res.status(200).json({
                    message: '게시물이 없습니다.'
                });
            }
        }else {
            res.status(404).json({
                message: '해당 유저가 존재하지 않습니다.'
            })
        }
    }
}
const { Post } = require('../../models');

module.exports = {

    // 상단 게시물 추가
    post: async (req, res) => {
        const { id } = req.body;

        try {
            const { top_post } = await Post.findOne({
                attributes: ['top_post'],
                where: { id: id },
                raw: true
            });
            if(!top_post){
                try {
                  await Post.update({ top_post: true }, { where: { id: id } });

                  res.status(200).json({
                      message: '상단 게시물에 추가 되었습니다.'
                  })
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

    }
}
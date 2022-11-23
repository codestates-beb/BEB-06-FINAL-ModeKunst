const { User, Post } = require('../../models');
const {literal} = require("sequelize");
const { many } = require('../function/createdAt');
module.exports = {

    // 검색
    get: async (req, res) => {
        const { nickname } = req.params;
        console.log(`입력받은 nickname: ${nickname}`);

        const user = await User.findOne({
            where: { nickname: nickname },
            attributes: ['nickname', 'profile_img', 'height', 'weight', 'gender', 'sns_url', 'followers_num', 'followings_num']
        });

        if(user) {
            const posts = await Post.findAll({
                where: {UserNickname: nickname},
                order: literal('likes_num DESC'),
                attributes: ['id', 'image_1', 'title', 'content', 'category', 'views', 'createdAt', 'UserNickname', 'likes_num', 'reviews_num'],
                raw: true
            });


            const dateFormatPosts = posts.map((post) =>{
                return new Date(post.createdAt);
            });

            const diff = many(dateFormatPosts);


            posts.map((post, i) => {
                post.createdAt = diff[i]
            });


            if(posts.length) {
                res.status(200).json({
                    message: `${nickname}님의 게시물 목록`,
                    data: {
                        user,
                        posts
                    }
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


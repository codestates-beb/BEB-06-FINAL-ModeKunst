const { User, Post } = require('../../models');
const {literal} = require("sequelize");

module.exports = {

    // 검색
    get: async (req, res) => {
        const { nickname } = req.params;
        console.log(`입력받은 nickname: ${nickname}`);

        const user = await User.findOne({
            where: { nickname: nickname },
        });

        if(user) {
            const posts = await Post.findAll({
                where: {UserNickname: nickname},
                order: literal('views DESC'),
                attributes: ['id', 'image_1', 'title', 'content', 'category', 'views', 'createdAt', 'UserNickname'],
                raw: true
            });

            // 현재 시간
            const today = new Date();

            const dateFormatPosts = posts.map((post) =>{
                return new Date(post.createdAt);
            });

            //console.log(dateFormatPosts);

            const diff = dateFormatPosts.map((time) => {
                const sec = Math.floor((today - time) / 1000);
                if(sec < 60) return '방금 전'
                const min = sec / 60
                if(min < 60) return `${Math.floor(min)}분 전`
                const hour = min / 60
                if(hour < 24) return `${Math.floor(hour)}시간 전`
                const day = hour / 24
                if(day / 7) return `${Math.floor(day)}일 전`
                const week = day / 7
                if(week < 5) return `${Math.floor(week)}주 전`
                const month = day / 30
                if(month < 12) return `${Math.floor(month)}개월 전`
                const year = day / 365
                return `${Math.floor(year)}`
            });


            posts.map((post, i) => {
                post.createdAt = diff[i]
            });


            if(posts.length) {
                res.status(200).json({
                    message: `${nickname}님의 게시물 목록`,
                    data: {
                        nickname: nickname,
                        posts : posts,
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
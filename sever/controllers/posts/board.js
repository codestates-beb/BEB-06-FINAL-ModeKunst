const Post = require('../../models/post');
const {many} = require('../function/createdAt');

module.exports = {

    // 전체 게시물
    get: async (req, res) => {
        //전체 게시물 가져오기 findAll
        //post에서는 이미지 1가져오기 
        //좋아요는 해당 post에서의 likes를 리스트를 뽑아오고 
        //배열에 나온 갯수 잡기 
        let pageNum = req.query.page; //페이지네이션 쓸 때 or 무한스크롤사용
        let offset = 0; //초기 오프셋

        if (pageNum > 1) {
            offset = 8 * (pageNum - 1);
            //페이지 하나에 10개의 게시물 리밋
            //offset은 시작
        }

        const postList = await Post.findAll({
            offset: offset,
            limit: 8,
            order:[['createdAt','DESC']],
        });
        console.log('포스트 목록 ', postList);

        const dateFormatPosts = postList.map((post)=>{
            return new Date(post.createdAt);
        });

        let diff = many(dateFormatPosts);


        const posts = postList.map((el,idx) => {
          return  {
              id: el.id,
              img: el.image_1,
              title: el.title,
              views: el.views,
              likes: el.likes_num,
              reviews: el.reviews_num,
              create_at: diff[idx],
              
            }
        })
        
        return res.status(200).json({ posts });



    },

}
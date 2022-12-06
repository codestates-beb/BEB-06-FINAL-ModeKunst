const { Post, User, Banner } = require("../../models");
const { many } = require("../function/createdAt");
const { literal, Op  } = require('sequelize');

module.exports = {

  // 배너 && 상단 게시물
  other: async (req, res) => {
    const banner = await Banner.findAll({
      order: literal('createdAt DESC'),
      attributes: ['id', 'image', 'url', 'createdAt'],
      raw: true
    });
    console.log(banner);
    const top_post = await Post.findAll({
      include: [ { model: User, attributes: ['profile_img'] } ],
      order: literal('createdAt DESC'),
      where: { top_post : { [Op.not] : 0 }},
      raw: true
    });

    const dateFormatPosts = top_post.map(post => {
      return new Date(post.createdAt);
    });

    let diff = many(dateFormatPosts);

    const top_posts = top_post.map((el, idx) => {
      return {
        id: el.id,
        image_1: el.image_1,
        title: el.title,
        category: el.category,
        views: el.views,
        likes_num: el.likes_num,
        reviews_num: el.reviews_num,
        createdAt: diff[idx],
        UserNickname: el.UserNickname,
        profile_img: el['User.profile_img'],
      };
    });

    res.status(200).json({
      message: 'banner and top_post',
      data: {
        banner,
        top_posts,
      }
    })
  },

  // 전체 게시물
  main: async (req, res) => {
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
      include: [ { model: User, attributes: ['profile_img'] } ],
      order: [["createdAt", "DESC"]],
      where: { top_post : { [Op.not] : 1 }},
      raw: true
    });


    const dateFormatPosts = postList.map(post => {
      return new Date(post.createdAt);
    });

    let diff = many(dateFormatPosts);

    const posts = postList.map((el, idx) => {
      return {
        id: el.id,
        image_1: el.image_1,
        title: el.title,
        category: el.category,
        views: el.views,
        likes_num: el.likes_num,
        reviews_num: el.reviews_num,
        createdAt: diff[idx],
        UserNickname: el.UserNickname,
        profile_img: el['User.profile_img'],
      };
    });

    return res.status(200).json({ posts });
  },
};

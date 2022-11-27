const { review } = require("./index");
const { many } = require("../function/createdAt");
const { Review, User, Server, Post, Token_price } = require("../../models");
const { web3, abi20, serverPKey, getBalance } = require("../../contract/Web3");

module.exports = {
  // 리뷰 작성 2 토큰
  post: async (req, res) => {
    const userInfo = req.session.user;
    const nickname = userInfo.nickname;
    const userAddress = userInfo.address;
    const { postId } = req.params;
    const { content } = req.body;
    console.log(
      `입력받은 nickname: ${nickname}, postId: ${postId}, content: ${content}`
    );
    try {
      const review = await Review.findOne({
        where: { UserNickname: nickname, PostId: postId },
        paranoid: false,
      });

      if (!review) {
        // 여기가 새 리뷰
        try {
          const price = await Token_price.findOne({
            where: { id: 1 },
            attributes: ["review"],
            raw: true,
          });
          const review_price = price.review;

          const serverInfo = await Server.findOne({
            attributes: ["address", "erc20"],
            raw: true,
          });
          const { address } = serverInfo;

          await Server.increment({ point_amount: review_price }, { where: { address: address } });

          await User.increment({ point_amount: review_price }, { where: { nickname: nickname } });

          await Review.create({
            content: content,
            UserNickname: nickname,
            PostId: postId,
          });

          const review_counts = await Review.count({
            where: { PostId: postId },
          });


          await Post.update(
            { reviews_num: review_counts },
            { where: { id: postId } }
          );

          const reviews = await Review.findAll({
            attributes: ["id", "content", "createdAt", "UserNickname"],
            where: { PostId: postId },
            raw: true,
          });

          res.status(200).json({
            message: "리뷰가 작성되었습니다.",
            data: {
              review_counts: review_counts,
              reviews: reviews,
            },
          });
        } catch (e) {
          console.log(`sequelize Err`);
          console.log(e);
        }
      } else {
        //리뷰 삭제 후 다시 작성
        if (review?.dataValues.deletedAt) {
          await Review.destroy({
            where: { UserNickname: nickname, PostId: postId },
            force: true,
          });

          await Review.create({
            content: content,
            UserNickname: nickname,
            PostId: postId,
          });

          const review_counts = await Review.count({
            where: { PostId: postId },
          });

          await Post.update(
              { reviews_num: review_counts },
              { where: { id: postId } }
          );

          const reviews = await Review.findAll({
            attributes: ["id", "content", "createdAt", "UserNickname"],
            where: { PostId: postId },
            raw: true,
          });

          res.status(200).json({
            message: "리뷰가 작성 되었습니다.",
            data: {
              review_counts: review_counts,
              reviews: reviews,
            },
          });
        } else {
          res.status(401).json({
            message: "이미 리뷰를 작성했습니다.",
          });
        }
      }
    } catch (e) {
      console.log(`sequelize Err`);
      console.log(e);
    }
  },

  get: async (req, res) => {
    //전체 리뷰 가져오기 findAll

    let { postId } = req.params;
    let pageNum = req.query.page; //무한스크롤 페이지네이션
    let offset = 0; //초기 오프셋

    if (pageNum > 1) {
      offset = 4 * (pageNum - 1);
    }

    const reviewList = await Review.findAll({
      offset: offset,
      limit: 4,
      order: [["createdAt", "DESC"]],
      where: { Postid: postId },
    });

    console.log("리뷰 목록", reviewList);

    const dateFormatReviews = reviewList.map(review => {
      return new Date(review.createdAt);
    });

    let diff = many(dateFormatReviews);

    const reviews = reviewList.map((el, idx) => {
      return {
        id: el.id,
        nickname: el.UserNickname,
        content: el.content,
        create_at: diff[idx],
      };
    });

    return res.status(200).json({ reviews });
  },

  // 리뷰 수정
  put: async (req, res) => {
    const nickname = req.session.user?.nickname;
    const { postId } = req.params;
    const { content } = req.body;

    try {
      await Review.update(
        { content: content },
        { where: { UserNickname: nickname, PostId: postId } }
      );

      const reviews_counts = await Review.count({
        where: { PostId: postId },
      });


      const reviews = await Review.findAll({
        attributes: ["id", "content", "createdAt", "UserNickname"],
        where: { PostId: postId },
        raw: true,
      });

      res.status(200).json({
        message: "리뷰가 수정되었습니다.",
        data: {
          reviews_counts: reviews_counts,
          reviews: reviews,
        },
      });
    } catch (e) {
      console.log(`sequelize Err`);
      console.log(e);
    }
  },

  // 리뷰 삭제
  delete: async (req, res) => {
    const nickname = req.session.user?.nickname;
    const { postId } = req.params;

    try {
      await Review.destroy({
        where: { UserNickname: nickname, PostId: postId },
      });

      const review_counts = await Review.count({
        where: { PostId: postId },
      });

      await Post.update(
          { reviews_num: review_counts },
          { where: { id: postId } }
      );

      const reviews = await Review.findAll({
        attributes: ["id", "content", "createdAt", "UserNickname"],
        where: { PostId: postId },
        raw: true,
      });

      res.status(200).json({
        message: "리뷰가 삭제되었습니다.",
        data: {
          review_counts: review_counts,
        },
      });
    } catch (e) {
      console.log(`sequelize Err`);
      console.log(e);
    }
  },
};

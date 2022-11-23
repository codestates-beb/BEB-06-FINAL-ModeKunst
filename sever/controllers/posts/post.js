const fs = require("fs");
const path = require("path");
const {
  User,
  Follow,
  Token,
  Like,
  Review,
  Post,
  Product_name,
  Product_brand,
  Product_size,
} = require("../../models");
const { literal, Op } = require("sequelize");
const { one } = require("../function/createdAt");

module.exports = {
  // 게시물 작성
  post: async (req, res) => {
    // 이미지가 3개 미만일 때 게시물 작성 안됨
    if (req.files.length <= 2) {
      req.files.map(file => {
        if (
          fs.existsSync(
            path.join(__dirname, "..", "..", "post_img", `${file.filename}`)
          )
        ) {
          //console.log(fs.existsSync(path.join(__dirname, '..', '..', 'post_img', `${file.filename}`)));;
          try {
            fs.unlinkSync(
              path.join(__dirname, "..", "..", "post_img", `${file.filename}`)
            );
          } catch (e) {
            console.log("multer Err");
            console.log(e);
          }
        }
      });
      res.status(404).json({
        message: "3개 이상의 사진을 등록 해주세요.",
      });
    } else {
      const { host } = req.headers;
      let imageList = [];
      req.files.map((file, i) => {
        imageList.push(file.path);
      });

      const imagePathList = imageList.map(image => {
        return `http://${host}/${image}`;
      });

      const [image_1, image_2, image_3, image_4, image_5] = imagePathList;

      const { nickname, title, content, category, top_post } = req.body;
      const {
        outer_brand,
        top_brand,
        pants_brand,
        shoes_brand,
        outer_name,
        top_name,
        pants_name,
        shoes_name,
        outer_size,
        top_size,
        pants_size,
        shoes_size,
      } = req.body;
      if (top_post) {
        // token 지불
      }
      try {
        let post;
        if (top_size) {
          console.log(nickname);
          // 보상 토큰 정상 지급
          post = await Post.create({
            image_1: image_1,
            image_2: image_2,
            image_3: image_3,
            image_4: image_4,
            image_5: image_5,
            title: title,
            content: content,
            category: category,
            price: 2,
            top_post: top_post,
            UserNickname: nickname,
          });

          const id = post.dataValues.id;
          // 옷 정보
          await Product_brand.create({
            outer: outer_brand,
            top: top_brand,
            pants: pants_brand,
            shoes: shoes_brand,
            PostId: id,
          });
          await Product_name.create({
            outer: outer_name,
            top: top_name,
            pants: pants_name,
            shoes: shoes_name,
            PostId: id,
          });
          await Product_size.create({
            outer: outer_size,
            top: top_size,
            pants: pants_size,
            shoes: 0,
            PostId: id,
          });
        } else {
          // 보상 토큰 적게 지급
          post = await Post.create({
            image_1: image_1,
            image_2: image_2,
            image_3: image_3,
            image_4: image_4,
            image_5: image_5,
            title: title,
            content: content,
            category: category,
            top_post: top_post,
            UserNickname: nickname,
          });

          // 옷 정보
          await Product_brand.create({
            outer: outer_brand,
            top: top_brand,
            pants: pants_brand,
            shoes: shoes_brand,
          });
          await Product_name.create({
            outer: outer_name,
            top: top_name,
            pants: pants_name,
            shoes: shoes_name,
          });
          await Product_size.create({
            outer: outer_size,
            top: top_size,
            pants: pants_size,
            shoes: shoes_size,
          });
        }

        res.status(200).json({
          message: "게시물이 등록 되었습니다.",
          data: {
            postId: post.dataValues.id,
          },
        });
      } catch (e) {
        console.log("Sequelize err");
        console.log(e);
      }
    }
  },

  /**
   * 디테일 페이지
   * @todo 토큰 정보 추가
   * @param req postId
   * @param res
   * @returns {Promise<void>} 1. 팔로우 했을 때, 좋아요 했을 때 ( 유저, 게시글, 리뷰, 옷 ) 정보, 좋아요 수, 2. 둘 다 안했을 때 ( 유저, 게시글, 리뷰 ) 정보, 좋아요 수
   */
  get: async (req, res) => {
    const loginNickname = req.session.user?.nickname;
    const { postId } = req.params;
    // postId의 작성자의 nft들
    console.log(`입력 받은 loginNickname: ${loginNickname}, postId: ${postId}`);
    try {
      await Post.increment({ views: 1 }, { where: { id: postId } });

      const post = await Post.findOne({
        where: { id: postId },
        include: [
          {
            model: Product_brand,
            attributes: ["outer", "top", "pants", "shoes"],
          },
          {
            model: Product_name,
            attributes: ["outer", "top", "pants", "shoes"],
          },
          {
            model: Product_size,
            attributes: ["outer", "top", "pants", "shoes"],
          },
        ],
        attributes: [
          "image_1",
          "image_2",
          "image_3",
          "image_4",
          "image_5",
          "title",
          "content",
          "category",
          "views",
          "createdAt",
          "UserNickname",
        ],
      });

      const {
        image_1,
        image_2,
        image_3,
        image_4,
        image_5,
        title,
        content,
        category,
        views,
        UserNickname,
      } = post.dataValues;
      const createdAt = one(post.dataValues?.createdAt);

      const userData = await User.findOne({
        where: { nickname: UserNickname },
        attributes: ["nickname", "height", "weight", "sns_url", "profile_img"],
      });

      const user = userData.dataValues;

      const similarLook = await Post.findAll({
        where: { category: category, id: { [Op.ne]: postId } },
        order: literal("views DESC"),
        limit: 15,
        attributes: ["id", "image_1", "title", "views", "UserNickname"],
        raw: true,
      });

      const reviews_counts = await Review.count({
        where: { PostId: postId },
      });

      const reviews = await Review.findAll({
        attributes: ["id", "content", "createdAt", "UserNickname"],
        where: { PostId: postId },
        raw: true,
      });

      const likes_counts = await Like.count({
        where: { PostId: postId },
      });

      if (loginNickname) {
        try {
          const like = await Like.findOne({
            where: { UserNickname: loginNickname, PostId: postId },
          });

          const isLike = !!like;

          const following = await Follow.findOne({
            where: { follower: loginNickname, following: UserNickname },
            paranoid: false,
            raw: true,
          });

          const isFollow = !!following;

          if (loginNickname === UserNickname) {
            // 자기가 쓴 게시물 detail 페이지는 isOwner
            res.status(200).json({
              message: `${title}의 디테일 페이지`,
              data: {
                post: {
                  image_1,
                  image_2,
                  image_3,
                  image_4,
                  image_5,
                  title,
                  content,
                  category,
                  views,
                  createdAt,
                },
                user,
                product_brand: post.Product_brand?.dataValues,
                product_name: post.Product_name?.dataValues,
                product_size: post.Product_size?.dataValues,
                likes_counts,
                reviews_counts,
                reviews,
                similarLook,
                isLike,
                isFollow: true,
                isOwner: true,
              },
            });
          } else {
            if (following) {
              res.status(200).json({
                message: `${title}의 디테일 페이지`,
                data: {
                  post: {
                    image_1,
                    image_2,
                    image_3,
                    image_4,
                    image_5,
                    title,
                    content,
                    category,
                    views,
                    createdAt,
                  },
                  user: user,
                  product_brand: post.Product_brand?.dataValues,
                  product_name: post.Product_name?.dataValues,
                  product_size: post.Product_size?.dataValues,
                  likes_counts,
                  reviews_counts: reviews_counts,
                  reviews: reviews,
                  similarLook: similarLook,
                  isFollow: isFollow,
                  isLike: isLike,
                  isOwner: false,
                },
              });
            } else {
              res.status(200).json({
                message: `${title}의 디테일 페이지`,
                data: {
                  post: {
                    image_1,
                    image_2,
                    image_3,
                    image_4,
                    image_5,
                    title,
                    content,
                    category,
                    views,
                    createdAt,
                  },
                  user: user,
                  product_brand: post.Product_brand?.dataValues,
                  product_name: post.Product_name?.dataValues,
                  product_size: post.Product_size?.dataValues,
                  likes_counts,
                  reviews_counts: reviews_counts,
                  reviews: reviews,
                  similarLook: similarLook,
                  isFollow: false,
                  isLike: isLike,
                  isOwner: false,
                },
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        res.status(200).json({
          message: `${title}의 디테일 페이지`,
          data: {
            post: {
              image_1,
              image_2,
              image_3,
              image_4,
              image_5,
              title,
              content,
              category,
              views,
              createdAt,
            },
            user: user,
            product_brand: post.Product_brand?.dataValues,
            product_name: post.Product_name?.dataValues,
            product_size: post.Product_size?.dataValues,
            likes_counts,
            reviews_counts: reviews_counts,
            reviews: reviews,
            similarLook: similarLook,
            isFollow: false,
            isLike: false,
            isOwner: false,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  // 게시물 수정
  /**
   * 게시물 수정
   * @todo 받는 인자 값 확실해지면 시작
   * @param req params( postId ), body ( title, content, category ), files ( files )
   * @param res
   * @returns {Promise<void>}
   */
  put: async (req, res) => {
    const { postId } = req.params;
    const { title, content, category } = req.body;
    // const files = req.files;

    // const images = await Post.findOne({
    //     attributes: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
    //     where: { id: postid}
    // });

    try {
      await Post.update(
        { title: title, content: content, category: category },
        { where: { id: postId } }
      );

      res.status(200).json({
        message: "게시물이 수정 되었습니다.",
      });
    } catch (e) {
      console.log("sequelize Err");
      console.log(e);
    }
  },

  // 게시물 삭제
  delete: async (req, res) => {
    const { postId } = req.params;
    const images = await Post.findOne({
      attributes: ["image_1", "image_2", "image_3", "image_4", "image_5"],
      where: { id: postId },
    });
    if (images) {
      const imagePathList = Object.values(images.dataValues);

      const fileNames = imagePathList.map(path => {
        if (path) {
          return path.slice(31);
        }
      });
      fileNames.map(name => {
        if (name) {
          if (
            fs.existsSync(
              path.join(__dirname, "..", "..", "post_img", `${name}`)
            )
          ) {
            try {
              fs.unlinkSync(
                path.join(__dirname, "..", "..", "post_img", `${name}`)
              );
            } catch (e) {
              console.log("multer Err");
              console.log(e);
            }
          }
        }
      });
      await Post.destroy({
        where: { id: postId },
      });
      await Product_brand.destroy({
        where: { id: postId },
      });
      await Product_name.destroy({
        where: { id: postId },
      });
      await Product_size.destroy({
        where: { id: postId },
      });

      res.status(200).json({
        message: "게시물이 삭제 되었습니다.",
      });
    }
  },
};
